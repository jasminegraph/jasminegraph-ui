#!/bin/bash
#
# Deploy JasmineGraph UI (frontend, backend, postgres, keycloak) to a local
# Kubernetes cluster (minikube or k3s/k3d). Structured to match
# ../jasminegraph/start-k8s.sh: plain `kubectl apply -f` manifests under
# k8s/, hostPath-backed volumes templated with envsubst, an `application`
# label for bulk cleanup, and a `clean` subcommand for teardown.
#
# Usage:
#   ./start-k8s.sh clean
#   ./start-k8s.sh [--CLUSTER_TYPE minikube|k3s|k3d] \
#                  [--POSTGRES_DATA_PATH <path>] [--BACKEND_CACHE_PATH <path>]
#
# All flags are optional — omitted paths default under $HOME/jasminegraph-ui-data
# and are created automatically; cluster type is auto-detected if omitted.

set -e

TIMEOUT_SECONDS=600
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$1" == "clean" ]; then
    echo "Cleaning JasmineGraph UI resources..."
    kubectl delete deployments -l application=jasminegraph-ui --ignore-not-found
    kubectl delete services -l application=jasminegraph-ui --ignore-not-found
    kubectl delete configmaps -l application=jasminegraph-ui --ignore-not-found
    kubectl delete secrets -l application=jasminegraph-ui --ignore-not-found
    kubectl delete pvc -l application=jasminegraph-ui --ignore-not-found
    kubectl delete pv -l application=jasminegraph-ui --ignore-not-found
    exit 0
fi

CLUSTER_TYPE=${CLUSTER_TYPE}
POSTGRES_DATA_PATH=${POSTGRES_DATA_PATH}
BACKEND_CACHE_PATH=${BACKEND_CACHE_PATH}
IMAGE_TAG=${IMAGE_TAG:-latest}

while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare "$param"="$2"
        echo "$1" "=" "$2"
    fi
    shift
done

detect_cluster() {
    if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
        echo "minikube"
    elif kubectl config current-context 2>/dev/null | grep -qi "k3d-"; then
        echo "k3d"
    elif command -v k3s >/dev/null 2>&1; then
        echo "k3s"
    else
        echo "unknown"
    fi
}

if [ -z "$CLUSTER_TYPE" ]; then
    CLUSTER_TYPE="$(detect_cluster)"
fi

if [ "$CLUSTER_TYPE" == "unknown" ]; then
    echo "Could not auto-detect minikube, k3s, or k3d."
    echo "Make sure your cluster is running, or pass the type explicitly:"
    echo "  ./start-k8s.sh --CLUSTER_TYPE minikube"
    echo "  ./start-k8s.sh --CLUSTER_TYPE k3s"
    echo "  ./start-k8s.sh --CLUSTER_TYPE k3d"
    exit 1
fi

echo "Target cluster: $CLUSTER_TYPE"

if [ -z "$POSTGRES_DATA_PATH" ]; then
    POSTGRES_DATA_PATH="$HOME/jasminegraph-ui-data/postgres"
fi

if [ -z "$BACKEND_CACHE_PATH" ]; then
    BACKEND_CACHE_PATH="$HOME/jasminegraph-ui-data/backend-cache"
fi

# minikube's kubelet runs inside its own VM/container, so hostPath refers to
# a path on the minikube node, not this machine. Create it there instead.
if [ "$CLUSTER_TYPE" == "minikube" ]; then
    minikube ssh -- "mkdir -p '$POSTGRES_DATA_PATH' '$BACKEND_CACHE_PATH'"
else
    mkdir -p "$POSTGRES_DATA_PATH" "$BACKEND_CACHE_PATH"
fi

FRONTEND_IMAGE="jasminegraph-frontend:${IMAGE_TAG}"
BACKEND_IMAGE="jasminegraph-backend:${IMAGE_TAG}"

echo "Building frontend image ($FRONTEND_IMAGE)..."
docker build -t "$FRONTEND_IMAGE" "$SCRIPT_DIR/Frontend"

echo "Building backend image ($BACKEND_IMAGE)..."
docker build -t "$BACKEND_IMAGE" "$SCRIPT_DIR/Backend"

echo "Loading images into $CLUSTER_TYPE..."
case "$CLUSTER_TYPE" in
    minikube)
        minikube image load "$FRONTEND_IMAGE"
        minikube image load "$BACKEND_IMAGE"
        ;;
    k3d)
        k3d image import "$FRONTEND_IMAGE" "$BACKEND_IMAGE"
        ;;
    k3s)
        if sudo systemctl cat k3s 2>/dev/null | grep -q -- '--docker'; then
            # k3s is configured to use the host Docker daemon as its
            # container runtime (--docker flag), so images built with
            # `docker build` are already visible to it — nothing to import.
            :
        else
            # k3s's embedded containerd is a separate runtime from the host
            # Docker daemon, so locally-built images have to be imported by hand.
            docker save "$FRONTEND_IMAGE" | sudo k3s ctr images import -
            docker save "$BACKEND_IMAGE" | sudo k3s ctr images import -
        fi
        ;;
esac

echo "Applying secrets..."
kubectl apply -f "$SCRIPT_DIR/k8s/secrets.yaml"

echo "Applying volumes..."
postgres_data_path="${POSTGRES_DATA_PATH}" \
    backend_cache_path="${BACKEND_CACHE_PATH}" \
    envsubst <"$SCRIPT_DIR/k8s/volumes.yaml" | kubectl apply -f -

echo "Generating config maps from Backend/src/db-init and Keycloak/jasminegraph-realm.json..."
kubectl create configmap jasminegraph-ui-db-init \
    --from-file="$SCRIPT_DIR/Backend/src/db-init" \
    --dry-run=client -o yaml | kubectl label -f - --local -o yaml application=jasminegraph-ui | kubectl apply -f -

kubectl create configmap jasminegraph-ui-keycloak-realm \
    --from-file="$SCRIPT_DIR/Keycloak/jasminegraph-realm.json" \
    --dry-run=client -o yaml | kubectl label -f - --local -o yaml application=jasminegraph-ui | kubectl apply -f -

echo "Applying postgres..."
kubectl apply -f "$SCRIPT_DIR/k8s/postgres-deployment.yaml" -f "$SCRIPT_DIR/k8s/postgres-service.yaml"
kubectl rollout status deployment/jasminegraph-ui-postgres-deployment --timeout="${TIMEOUT_SECONDS}s"

echo "Applying backend..."
kubectl apply -f "$SCRIPT_DIR/k8s/backend-deployment.yaml" -f "$SCRIPT_DIR/k8s/backend-service.yaml"
kubectl rollout status deployment/jasminegraph-ui-backend-deployment --timeout="${TIMEOUT_SECONDS}s"

echo "Applying keycloak..."
kubectl apply -f "$SCRIPT_DIR/k8s/keycloak-deployment.yaml" -f "$SCRIPT_DIR/k8s/keycloak-service.yaml"
kubectl rollout status deployment/jasminegraph-ui-keycloak-deployment --timeout="${TIMEOUT_SECONDS}s"

echo "Applying frontend..."
kubectl apply -f "$SCRIPT_DIR/k8s/frontend-deployment.yaml" -f "$SCRIPT_DIR/k8s/frontend-service.yaml"
kubectl rollout status deployment/jasminegraph-ui-frontend-deployment --timeout="${TIMEOUT_SECONDS}s"

echo ""
echo "All JasmineGraph UI pods are running."
case "$CLUSTER_TYPE" in
    minikube)
        minikube service jasminegraph-ui-frontend-service --url
        ;;
    *)
        NODE_IP="$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')"
        echo "Connect to JasmineGraph UI at http://$NODE_IP:30080"
        ;;
esac

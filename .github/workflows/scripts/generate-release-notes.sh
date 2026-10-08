#!/usr/bin/env bash
# Builds RELEASE_NOTES.md for the current tag by grouping every PR merged into
# the base branches (main and develop by default; override with
# PR_BASE_BRANCHES="main develop") since the previous tag, using each PR's
# label, title, author and description. Then appends the latest JasmineGraph
# (core engine) release, so each UI release records the engine release it
# was cut alongside (override the source repo with JASMINEGRAPH_REPO).
# Requires: gh (authenticated via GH_TOKEN), jq, git history with tags
# (checkout must use fetch-depth: 0).
set -euo pipefail

CURRENT_TAG="${TAG:-${GITHUB_REF_NAME}}"
REPO="${GITHUB_REPOSITORY}"
PR_BASE_BRANCHES=(${PR_BASE_BRANCHES:-main develop})

# Previous tag = the tag created just before CURRENT_TAG (so re-releasing an
# older tag still gets the correct range, not the newest tag in the repo).
PREV_TAG=$(git tag --sort=-creatordate | awk -v cur="${CURRENT_TAG}" 'found {print; exit} $0 == cur {found=1}' || true)

UNTIL=$(TZ=UTC git log -1 --date='format-local:%Y-%m-%dT%H:%M:%SZ' --format=%cd "${CURRENT_TAG}")
if [[ -n ${PREV_TAG} ]]; then
    SINCE=$(TZ=UTC git log -1 --date='format-local:%Y-%m-%dT%H:%M:%SZ' --format=%cd "${PREV_TAG}")
else
    SINCE="1970-01-01T00:00:00Z"
fi

PRS_JSON="[]"
for base in "${PR_BASE_BRANCHES[@]}"; do
    BASE_PRS=$(gh pr list --repo "${REPO}" --state merged --base "${base}" \
        --json number,title,body,author,labels,mergedAt,url --limit 300)
    PRS_JSON=$(jq -n --argjson a "${PRS_JSON}" --argjson b "${BASE_PRS}" '$a + $b | unique_by(.number)')
done

FILTERED=$(echo "${PRS_JSON}" | jq --arg since "${SINCE}" --arg until "${UNTIL}" \
    '[.[] | select(.mergedAt > $since and .mergedAt <= $until)]')

print_pr() {
    # $1 = single PR object (compact JSON)
    local pr_json num title author url body
    pr_json="$1"
    num=$(echo "${pr_json}" | jq -r '.number')
    title=$(echo "${pr_json}" | jq -r '.title')
    author=$(echo "${pr_json}" | jq -r '.author.login')
    url=$(echo "${pr_json}" | jq -r '.url')
    body=$(echo "${pr_json}" | jq -r '.body // ""' | tr -d '\r')

    echo "- **${title}** ([#${num}](${url})) by @${author}"
    if [[ -n "$(echo "${body}" | tr -d '[:space:]')" ]]; then
        echo "${body}" | head -c 500 | sed 's/^/  > /'
        echo
    fi
    echo
}

print_jasminegraph_release() {
    # Latest published (non-draft) JasmineGraph release; stable preferred,
    # newest pre-release as fallback. Never fails the notes generation.
    local jg_repo jg_json
    jg_repo="${JASMINEGRAPH_REPO:-miyurud/jasminegraph}"
    jg_json=$(gh release view --repo "${jg_repo}"         --json tagName,name,url,publishedAt,body,isPrerelease 2>/dev/null || true)
    if [[ -z ${jg_json} ]]; then
        jg_json=$(gh release list --repo "${jg_repo}" --limit 1 --json tagName 2>/dev/null             | jq -r '.[0].tagName // empty'             | xargs -r -I{} gh release view {} --repo "${jg_repo}"                 --json tagName,name,url,publishedAt,body,isPrerelease 2>/dev/null || true)
    fi
    echo "## 🧬 Latest JasmineGraph Release"
    echo
    if [[ -z ${jg_json} ]]; then
        echo "_Could not fetch the latest release of [${jg_repo}](https://github.com/${jg_repo}/releases)._"
        echo
        return
    fi
    local tag name url published pre body
    tag=$(echo "${jg_json}" | jq -r '.tagName')
    name=$(echo "${jg_json}" | jq -r '.name // .tagName')
    url=$(echo "${jg_json}" | jq -r '.url')
    published=$(echo "${jg_json}" | jq -r '.publishedAt[:10]')
    pre=$(echo "${jg_json}" | jq -r 'if .isPrerelease then " (pre-release)" else "" end')
    body=$(echo "${jg_json}" | jq -r '.body // ""' | tr -d '')
    echo "**[${name}](${url})** (\`${tag}\`)${pre} - published ${published}"
    echo
    if [[ -n "$(echo "${body}" | tr -d '[:space:]')" ]]; then
        echo "<details><summary>JasmineGraph ${tag} release notes</summary>"
        echo
        echo "${body}" | head -c 6000
        echo
        echo
        echo "</details>"
        echo
    fi
}

{
    echo "## What's Changed"
    echo

    CATEGORIZED_NUMBERS="[]"
    declare -A SECTION_TITLES=(
        [enhancement]="🚀 New Features"
        [bug]="🐛 Bug Fixes"
        [documentation]="📚 Documentation"
        [maintenance]="🧰 Maintenance"
        [dependencies]="⬆️ Dependencies"
    )
    CATEGORY_ORDER=(enhancement bug documentation maintenance dependencies)

    for label in "${CATEGORY_ORDER[@]}"; do
        SECTION_PRS=$(echo "${FILTERED}" | jq --arg label "${label}" \
            '[.[] | select([.labels[].name] | index($label))]')
        COUNT=$(echo "${SECTION_PRS}" | jq 'length')
        if [[ ${COUNT} -gt 0 ]]; then
            echo "### ${SECTION_TITLES[$label]}"
            echo
            while IFS= read -r pr; do
                print_pr "${pr}"
            done < <(echo "${SECTION_PRS}" | jq -c '.[]')
            NUMS=$(echo "${SECTION_PRS}" | jq '[.[].number]')
            CATEGORIZED_NUMBERS=$(jq -n --argjson a "${CATEGORIZED_NUMBERS}" --argjson b "${NUMS}" '$a + $b')
        fi
    done

    OTHER_PRS=$(echo "${FILTERED}" | jq --argjson used "${CATEGORIZED_NUMBERS}" \
        '[.[] | select(.number as $n | ($used | index($n)) | not)]')
    OTHER_COUNT=$(echo "${OTHER_PRS}" | jq 'length')
    if [[ ${OTHER_COUNT} -gt 0 ]]; then
        echo "### 🔧 Other Changes"
        echo
        while IFS= read -r pr; do
            print_pr "${pr}"
        done < <(echo "${OTHER_PRS}" | jq -c '.[]')
    fi

    TOTAL=$(echo "${FILTERED}" | jq 'length')
    if [[ ${TOTAL} -eq 0 ]]; then
        echo "_No merged pull requests found for this release._"
        echo
    fi

    echo "---"
    print_jasminegraph_release
    echo "---"
    if [[ -n ${PREV_TAG} ]]; then
        echo "**Full Changelog**: https://github.com/${REPO}/compare/${PREV_TAG}...${CURRENT_TAG}"
    else
        echo "**Full Changelog**: https://github.com/${REPO}/commits/${CURRENT_TAG}"
    fi
} >RELEASE_NOTES.md

cat RELEASE_NOTES.md

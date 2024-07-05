import { toast } from "react-toastify";

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyInfo = (message: string) =>
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyPromise = (
  promise: Promise<any>,
  message: { pending: string; success: string; error: string }
) =>
  toast.promise(promise, message, {
    position: "top-right",
    hideProgressBar: true,
    draggable: true,
    progress: undefined,
  });

export { notifySuccess, notifyError, notifyInfo, notifyPromise };

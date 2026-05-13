import { toast, type ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (
    message: string,
    type: ToastType = "success",
    options?: ToastOptions
) => {
    toast[type](message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};

export const dismissToasts = () => {
    toast.dismiss();
};
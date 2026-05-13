import { create } from "zustand";

type ConfirmOptions = {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    disableCancel?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
};

type ConfirmState = ConfirmOptions & {
    open: boolean;
    show: (options: ConfirmOptions) => void;
    close: () => void;
};

/* ✅ default state */
const defaultState: ConfirmOptions = {
    title: undefined,
    message: undefined,
    confirmText: "Confirm",
    cancelText: "Cancel",
    disableCancel: false,
    onConfirm: undefined,
    onCancel: undefined,
};

export const useConfirmStore = create<ConfirmState>((set, get) => ({
    ...defaultState,
    open: false,

    show: (options) => {
        set({
            ...defaultState,
            ...options,
            open: true,

            onConfirm: () => {
                options.onConfirm?.();
                get().close();
            },

            onCancel: () => {
                options.onCancel?.();
                get().close();
            },
        });
    },

    close: () => {
        set({
            ...defaultState,
            open: false,
        });
    },
}));
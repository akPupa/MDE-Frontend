import { useConfirmStore } from "@stores/confirmStore";
import { ConfirmModal } from "./ConfirmModal";

export function ConfirmRoot() {
    const {
        open,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        disableCancel,
    } = useConfirmStore();

    return (
        <ConfirmModal
            open={open}
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={onConfirm || (() => { })}
            onCancel={onCancel || (() => { })}
            disableCancel={disableCancel}
        />
    );
}
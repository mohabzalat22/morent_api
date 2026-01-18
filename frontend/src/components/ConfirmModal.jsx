import React from "react";

function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading,
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col gap-4">
                <h3 className="text-xl font-bold text-red-600">{title}</h3>
                <p className="text-gray-700 dark:text-gray-200">{message}</p>
                <div className="flex gap-4 mt-4">
                    <button
                        className="px-4 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg font-bold bg-gray-300 text-gray-700 hover:bg-gray-400"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;

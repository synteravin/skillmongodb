import { Dialog } from "@headlessui/react";

type Props = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Dialog open={open} onClose={onCancel} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                <Dialog.Panel className="bg-white rounded-xl p-6 w-[400px]">

                    <Dialog.Title className="text-lg font-semibold">
                        {title}
                    </Dialog.Title>

                    <p className="mt-2 text-gray-600">
                        {message}
                    </p>

                    <div className="flex justify-end gap-2 mt-6">

                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                            Confirm
                        </button>

                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
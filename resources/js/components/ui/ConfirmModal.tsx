import Modal from './Modal';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'info' | 'primary';
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmModal({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onClose,
}: Props) {
    const getIcon = () => {
        if (variant === 'danger') {
            return (
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
            );
        }
        if (variant === 'info') {
            return (
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Info className="w-5 h-5 stroke-[2.5]" />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
        );
    };

    const getConfirmBtnStyle = () => {
        if (variant === 'danger') {
            return 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm';
        }
        return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm';
    };

    return (
        <Modal open={open} title={title} onClose={onClose} maxWidth="max-w-md">
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    {getIcon()}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getConfirmBtnStyle()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

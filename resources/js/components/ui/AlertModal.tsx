import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

type Props = {
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
};

export default function AlertModal({
    open,
    title = 'Information',
    message,
    onClose,
}: Props) {
    return (
        <Modal open={open} title={title} onClose={onClose} maxWidth="max-w-md">
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
}

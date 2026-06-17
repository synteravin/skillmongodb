import { ReactNode } from "react"

type Props = {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
    maxWidth?: string
}

export default function Modal({ open, title, onClose, children, maxWidth = "max-w-lg" }: Props) {

    if (!open) return null

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
            />

            {/* MODAL */}
            <div className={`relative w-full ${maxWidth} mx-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] shadow-xl dark:shadow-none p-6 transition-all`}>

                {/* Header */}
                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        ✕
                    </button>

                </div>

                {/* Divider */}
                <div className="border-b border-slate-200 dark:border-white/5 mb-4"></div>

                {children}

            </div>

        </div>

    )

}
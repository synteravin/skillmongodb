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
            <div className={`relative w-full ${maxWidth} mx-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0b0f2a] shadow-xl p-6 transition-all`}>

                {/* Header */}
                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 dark:text-slate-400"
                    >
                        ✕
                    </button>

                </div>

                {/* Divider */}
                <div className="border-b border-gray-200 dark:border-slate-700 mb-4"></div>

                    {children}
               

            </div>

        </div>

    )

}
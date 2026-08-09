import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

type Props = {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
    maxWidth?: string
}

export default function Modal({ open, title, onClose, children, maxWidth = "max-w-lg" }: Props) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!open || !mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* BACKDROP */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
            />

            {/* MODAL */}
            <div className={`relative w-full ${maxWidth} my-auto flex max-h-[90vh] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xl transition-all z-10 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none sm:p-6`}>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body with internal scroll */}
                <div className="flex-1 overflow-y-auto pt-4 pr-1">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
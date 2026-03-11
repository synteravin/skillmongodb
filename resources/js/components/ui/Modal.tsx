import { ReactNode } from "react"

type Props = {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

export default function Modal({ open, title, onClose, children }: Props) {

    if (!open) return null

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}

            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* MODAL */}

            <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/30 bg-white/90 backdrop-blur-xl shadow-2xl p-6 animate-in fade-in zoom-in-95">

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>

                </div>

                {children}

            </div>

        </div>

    )

}
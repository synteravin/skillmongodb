type Props = {
    title: string
    index: number
    isLast?: boolean
    isSubmission?: boolean
    badge?: {
        icon: string
    }
}

export default function ModuleNode({ title, index, isLast, isSubmission, badge }: Props) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const roman = romanNumerals[index] || (index + 1);

    return (
        <div className="flex flex-col items-center w-full relative z-10">
            <div className="relative w-[95%] sm:w-full rounded-md flex items-center p-1 sm:p-1.5 overflow-hidden border-2 shadow-lg mb-0 z-10 border-[#3a50d2] bg-[#11172a] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">

                {/* Left Badge - Crown style */}
                <div className="relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 bg-black flex items-center justify-center font-['Orbitron'] font-bold border-[#d97706] text-[#d97706]">
                    {badge?.icon ? (
                        <img
                            src={`/storage/${badge.icon}`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <span>
                            {isSubmission ? '★' : roman}
                        </span>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-[#3a50d2]">
                        <svg className="w-3 h-3 text-[#3a50d2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
                    </div>
                </div>

                {/* Title */}
                <div className="flex-1 px-3 text-[10px] sm:text-xs font-semibold truncate leading-tight font-sans">
                    {title}
                </div>
            </div>

            {/* Connecting Pipe */}
            {!isLast && <div className="w-[2px] h-6 bg-gray-300"></div>}
        </div>
    )
}
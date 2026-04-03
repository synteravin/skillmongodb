import { Target } from 'lucide-react';

type Props = {
    title: string
    index: number
    isLast?: boolean
}

export default function FundamentalNode({ title, index, isLast }: Props) {
    return (
        <div className="flex flex-col items-center relative z-10">
            {/* The box itself */}
            <div className="w-[300px] sm:w-[350px] p-[2px] rounded border border-transparent bg-gradient-to-b from-[#1e2759] to-[#040812] shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <div className="w-full h-full rounded border border-yellow-500/80 bg-[#0a0f1d] p-3 flex gap-3 items-center">
                    {/* Icon section */}
                    <div className="w-12 h-12 bg-blue-900/40 rounded flex items-center justify-center border border-blue-500 flex-shrink-0">
                        <Target className="w-6 h-6 text-yellow-500" />
                    </div>
                    {/* Text section */}
                    <div className="flex flex-col text-left">
                        <h3 className="font-['Orbitron'] font-bold text-white text-sm sm:text-sm leading-tight uppercase tracking-wide">
                            {title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 leading-snug font-sans">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliqua.
                        </p>
                    </div>
                </div>
            </div>

            {/* Connecting pipe */}
            <div className={`w-[2px] ${isLast ? 'h-10' : 'h-12'} bg-gray-300`}></div>
        </div>
    )
}
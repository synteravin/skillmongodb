import { Target } from 'lucide-react';
import { Link } from '@inertiajs/react';

type Props = {
    title: string
    index: number
    isLast?: boolean
    href?: string
}

export default function FundamentalNode({ title, index, isLast, href }: Props) {
    return (
        <div className="flex flex-col items-center relative z-10">

            <Link href={href || "#"} className="w-full hover:scale-105 transition">

                <div className="w-[300px] sm:w-[350px] p-[2px] rounded border border-transparent bg-gradient-to-b from-[#1e2759] to-[#040812] shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <div className="w-full h-full rounded border border-yellow-500/80 bg-[#0a0f1d] p-3 flex gap-3 items-center">

                        <div className="w-12 h-12 bg-blue-900/40 rounded flex items-center justify-center border border-blue-500">
                            <Target className="w-6 h-6 text-yellow-500" />
                        </div>

                        <div className="flex flex-col text-left">
                            <h3 className="font-bold text-white text-sm uppercase">
                                {title}
                            </h3>
                        </div>

                    </div>
                </div>

            </Link>

            <div className={`w-[2px] ${isLast ? 'h-10' : 'h-12'} bg-gray-300`}></div>
        </div>
    )
}
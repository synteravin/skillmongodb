import React from "react";
import { Link } from "@inertiajs/react";
import { Target } from "lucide-react";

type Props = {
    title: string;
    locked?: boolean;
    done?: boolean;
    thumbnail?: string | null;
    href?: string;
};

export default function StudentFundamentalNode({ title, locked = false, done = false, thumbnail, href }: Props) {
    const Wrapper = href && !locked ? Link : "div";

    return (
        <div className={`relative flex flex-col items-center w-[300px] sm:w-[350px] z-10 transition-all ${locked ? 'opacity-40 grayscale' : ''}`}>
             <Wrapper 
                 {...(href && !locked ? { href } : {})}
                 className={`block w-full p-[2px] rounded border border-transparent bg-gradient-to-b from-[#1e2759] to-[#040812] shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-transform ${href && !locked ? 'hover:scale-105' : ''}`}
             >
                 <div className={`w-full h-full rounded border ${done ? 'border-green-500' : 'border-yellow-500/80'} bg-[#0a0f1d] p-3 flex gap-3 items-center`}>
                     <div className="w-12 h-12 bg-blue-900/40 rounded flex items-center justify-center border border-blue-500 flex-shrink-0 overflow-hidden">
                         {thumbnail ? (
                             <img src={`/storage/${thumbnail}`} className="w-full h-full object-cover" alt="thumbnail" />
                         ) : (
                             <Target className={`w-6 h-6 ${done ? 'text-green-500' : 'text-yellow-500'}`} />
                         )}
                     </div>
                     <div className="flex flex-col text-left">
                         <h3 className="font-['Orbitron'] font-bold text-white text-sm sm:text-sm leading-tight uppercase tracking-wide">
                             {title}
                         </h3>
                         <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 leading-snug font-sans truncate whitespace-normal line-clamp-2">
                             Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliqua.
                         </p>
                     </div>
                 </div>
             </Wrapper>
        </div>
    );
}

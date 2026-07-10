import React from 'react';
import { Pin } from 'lucide-react';
import { PinnedMessage } from './types';

interface PinnedMessageBarProps {
    pinnedMessages: PinnedMessage[];
    scrollToMessage: (msgId: string) => void;
}

export default function PinnedMessageBar({
    pinnedMessages,
    scrollToMessage,
}: PinnedMessageBarProps) {
    if (pinnedMessages.length === 0) return null;
    
    const latestPinned = pinnedMessages[pinnedMessages.length - 1];

    return (
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-[#facc15]/20 bg-[#121212] px-4 py-2 md:px-4 md:py-2 lg:px-6 lg:py-2.5 font-['Oxanium'] text-xs text-slate-300">
            <div
                className="flex flex-1 cursor-pointer items-center gap-2 truncate transition duration-300 hover:text-white"
                onClick={() => scrollToMessage(latestPinned.id)}
            >
                <Pin className="h-3.5 w-3.5 shrink-0 rotate-45 text-[#facc15]" />
                <span className="shrink-0 font-bold text-[#facc15]">
                    Sematkan:
                </span>
                <span className="truncate italic">
                    "{latestPinned.message}"
                </span>
            </div>
            <span className="ml-4 shrink-0 font-['Orbitron'] text-[10px] text-slate-500">
                Oleh {latestPinned.sender_name}
            </span>
        </div>
    );
}

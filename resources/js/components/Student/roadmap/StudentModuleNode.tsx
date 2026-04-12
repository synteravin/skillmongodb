import React from "react";
import { Link } from "@inertiajs/react";

type Props = {
    title: string;
    locked?: boolean;
    done?: boolean;
    index?: number;
    isSubmission?: boolean;
    badge?: {
        icon?: string | null;
    } | null;
    href?: string;
};

export default function StudentModuleNode({
    title,
    locked = false,
    done = false,
    index = 0,
    isSubmission = false,
    badge,
    href,
}: Props) {
    const romanNumerals = [
        "I", "II", "III", "IV", "V", "VI",
        "VII", "VIII", "IX", "X", "XI", "XII"
    ];

    const roman = romanNumerals[index] || (index + 1);

    const hasValidIcon =
        badge &&
        badge.icon &&
        badge.icon !== "null" &&
        badge.icon !== "";

    const Wrapper = href && !locked && !isSubmission ? Link : "div";

    return (
        <div className="flex flex-col items-center w-full relative z-10 px-1 sm:px-0">

            {/* CARD */}
            <Wrapper
                {...(href && !locked && !isSubmission ? { href } : {})}
                className={`
          block relative w-full rounded-md flex items-center p-1 sm:p-1.5 overflow-hidden border-2 shadow-lg transition-all ${href && !locked && !isSubmission ? "hover:scale-105" : ""}
          ${done
                        ? "border-green-500 bg-[#061810] text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        : "border-[#3a50d2] bg-[#11172a] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"}
          ${locked ? "opacity-40 grayscale" : ""}
        `}
            >

                {/* ICON / LEVEL */}
                <div
                    className={`
            relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 
            rounded-full border-2 bg-black flex items-center justify-center 
            font-['Orbitron'] font-bold
            ${done
                            ? "border-green-500 text-green-500"
                            : "border-[#d97706] text-[#d97706]"}
          `}
                >

                    {/* 🛡️ BADGE (DI DALAM) */}
                    {hasValidIcon ? (
                        <img
                            src={`/storage/${badge?.icon}`}
                            className="w-full h-full object-cover rounded-full"
                            alt="badge"
                        />
                    ) : (
                        <span className="text-xs sm:text-sm">
                            {isSubmission ? "★" : roman}
                        </span>
                    )}

                    {/* STATUS */}
                    <div
                        className={`
              absolute -bottom-1 -right-1 bg-black rounded-full p-[2px] border z-20
              ${done ? "border-green-500" : "border-[#3a50d2]"}
            `}
                    >
                        {locked ? (
                            <span className="text-[8px] text-gray-500">🔒</span>
                        ) : (
                            <svg
                                className={`w-3 h-3 ${done ? "text-green-500" : "text-[#3a50d2]"}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d={
                                        done
                                            ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                            : "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                                    }
                                />
                            </svg>
                        )}
                    </div>
                </div>

                {/* TITLE */}
                <div className="flex-1 px-3 text-[11px] sm:text-xs font-semibold truncate leading-tight font-sans">
                    {title}
                </div>

            </Wrapper>
        </div>
    );
}
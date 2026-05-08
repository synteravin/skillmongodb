import React from "react";
import { Link } from "@inertiajs/react";
import { Check, Lock, Shield } from "lucide-react";

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

    const Wrapper = href && !locked ? Link : "div";

    return (
        <div className="flex flex-col items-center w-full relative px-1 sm:px-0">
            <Wrapper
                {...(href && !locked ? { href } : {})}
                className={`
            block relative w-full flex items-center gap-3 overflow-hidden
            transition-all duration-300
            ${href && !locked ? "hover:scale-[1.02] hover:brightness-110" : ""}
            ${locked ? "opacity-40 grayscale" : ""}
        `}
                style={{
                    borderRadius: "14px",
                    padding: "2px",
                    background: done
                        ? "linear-gradient(to right, #99E4FD, #9681FF)"
                        : "linear-gradient(to right, #99E4FD, #9681FF)",
                    boxShadow: done
                        ? "0 4px 24px rgba(150,200,255,0.2)"
                        : "0 4px 24px rgba(150,129,255,0.2)",
                }}
            >
                {/* Inner container */}
                <div
                    className="flex items-center gap-3 w-full overflow-hidden"
                    style={{
                        borderRadius: "12px",
                        background: done
                            ? "linear-gradient(135deg, #0a2a1a 0%, #0d1f2d 100%)"
                            : "linear-gradient(135deg, #1a2060 0%, #0e1540 100%)",
                        minHeight: "64px",
                    }}
                >
                    {/* Badge / Icon — full height, flush left */}
                    <div
                        className="relative flex-shrink-0 self-stretch"
                        style={{
                            width: "64px",
                            borderRadius: "10px 0 0 10px",
                            background: "#000",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {hasValidIcon ? (
                            <img
                                src={badge?.icon || undefined}
                                className="w-full h-full object-cover bg-black"
                                alt="badge"
                            />
                        ) : (
                            <span
                                className="font-bold text-lg"
                                style={{
                                    fontFamily: "Orbitron, sans-serif",
                                    color: done ? "#4ade80" : "#d97706",
                                }}
                            >
                                {isSubmission ? "★" : roman}
                            </span>
                        )}

                        {/* Status badge pojok kanan bawah */}
                        <div
                            className="absolute bottom-1 right-1 flex items-center justify-center z-20"
                            style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#000",
                                border: done
                                    ? "1.5px solid #4ade80"
                                    : locked
                                        ? "1.5px solid #555"
                                        : "1.5px solid #99E4FD",
                                boxShadow: done
                                    ? "0 0 6px rgba(74,222,128,0.6)"
                                    : locked
                                        ? "none"
                                        : "0 0 6px rgba(153,228,253,0.5)",
                            }}
                        >
                            {locked ? (
                                <Lock className="w-2 h-2 text-gray-500" />
                            ) : done ? (
                                <Check className="w-2 h-2 text-green-400" />
                            ) : (
                                <Shield className="w-2 h-2 text-[#99E4FD]" />
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div
                        className="flex-1 pr-3 py-2 leading-snug font-semibold text-white text-xs"
                        style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                        {title}
                    </div>

                    {/* Right glow accent */}
                    <div
                        className="absolute right-0 top-0 h-full w-16 pointer-events-none"
                        style={{
                            background: "linear-gradient(to left, rgba(150,129,255,0.1), transparent)",
                            borderRadius: "0 12px 12px 0",
                        }}

                    />
                </div>
            </Wrapper>
        </div>
    );
}
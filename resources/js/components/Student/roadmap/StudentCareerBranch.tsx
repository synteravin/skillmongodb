import React from "react";
import StudentModuleNode from "./StudentModuleNode";
import { User } from "lucide-react";

type Props = {
    group: any;
    progress: any;
    badges?: any[];
    courseId?: string;
    basicCompleted: boolean;
};

export default function StudentCareerBranch({ group, progress, badges = [], courseId, basicCompleted }: Props) {

    const isChosen = group.paths.some((p: any) => p._id === progress.selected_path_id);
    const isOtherChosen = progress.selected_path_id && !isChosen;
    const totalModules = group.paths.reduce((sum: number, p: any) => sum + (p.modules?.length || 0), 0);

    return (
        <div className="flex flex-col items-center w-full px-8 sm:px-4 relative text-sans">
            <div className={`relative w-full rounded-xl flex flex-col shadow-lg mb-0 transition-all overflow-hidden
                border-2
                ${isChosen 
                    ? 'border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.35)]' 
                    : 'border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.5)]'}
                ${(!basicCompleted || isOtherChosen) ? 'grayscale opacity-50' : ''}
            `}>
                {/* GRADIENT BORDER TOP ACCENT */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-10" />

                <div className="w-full h-full rounded-xl bg-[#050619] flex flex-col p-5 relative">

                    {/* LOCK OVERLAY */}
                    {(!basicCompleted || isOtherChosen) && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="opacity-80 drop-shadow-xl">
                                <rect x="4" y="10" width="16" height="12" rx="3" fill="#050d1f" stroke="#1e3a8a" strokeWidth="1.5"/>
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="16" r="2" fill="#1e3a8a"/>
                                <path d="M12 16v2.5" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                    )}

                    {/* THUMBNAIL — bulat di tengah atas */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            {/* glow ring */}
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md scale-110" />
                            <div className="relative w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden bg-[#0b1333] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                {group.thumbnail ? (
                                    <img
                                        src={`/storage/${group.thumbnail}`}
                                        className="w-full h-full object-cover"
                                        alt={group.name}
                                    />
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-blue-400">
                                        <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                        <path d="M9 15l-2 4 3-1M15 15l2 4-3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-base sm:text-lg font-['Orbitron'] font-bold text-center text-white mb-2 uppercase tracking-widest leading-tight">
                        {group.name}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-[10px] text-gray-400 font-semibold text-center mb-4 leading-relaxed px-1 line-clamp-4">
                        A special package to become a professional {group.name} Developer, starting with modern web development fundamentals and progressing to advanced topics and real-world projects
                    </p>

                    {/* STATS */}
                    <div className="flex justify-between gap-2 mb-4">
                        <div className="flex-1 bg-[#020101] border border-[#1A2E99] rounded-lg p-2 text-center flex flex-col items-center justify-center gap-0.5">
                            <span className="block text-[9px] text-[#F0E427] font-semibold tracking-wider uppercase">Modules</span>
                            <span className="block text-sm font-bold text-[#B3B3B3]">{totalModules} Units</span>
                        </div>
                        <div className="flex-1 bg-[#020101] border border-[#1A2E99] rounded-lg p-2 text-center flex flex-col items-center justify-center gap-0.5">
                            <span className="block text-[9px] text-[#F0E427] font-semibold tracking-wider uppercase">Formats</span>
                            <span className="block text-sm font-bold text-[#B3B3B3]">Video & project</span>
                        </div>
                    </div>

                    {/* FOOTER — mentor + button */}
                    <div className="pt-3 border-t border-[#1A2E99]/80 flex justify-between items-center relative z-40">
                        {/* MENTOR */}
                        <div className="flex items-center gap-2 max-w-[60%]">
                            {group.mentor && group.mentor.avatar && group.mentor.avatar !== "null" ? (
                                <img
                                    src={group.mentor.avatar.startsWith('http') ? group.mentor.avatar : `/storage/${group.mentor.avatar}`}
                                    className="w-10 h-10 rounded-full border border-gray-400 object-cover flex-shrink-0"
                                    alt="mentor"
                                />
                          ) : (
                            <div className="w-12 h-12 rounded-full border border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                {group.mentor?.name ? (
                                    <span className="text-[11px] font-bold text-white">
                                        {group.mentor.name.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <User className="w-5 h-5 text-white" />
                                )}
                            </div>
                        )}
                            <div className="flex flex-col truncate">
                                <span className="text-[10px] font-bold text-[#F0F0F0] leading-none truncate">
                                    {group.mentor?.name ?? 'No Mentor'}
                                </span>
                                <span className="text-[8px] text-gray-400 mt-0.5 truncate">
                                    {group.mentor ? `${group.name} Professional` : 'Unassigned'}
                                </span>
                            </div>
                        </div>

                       {/* START BUTTON */}
                            <button
                                disabled={!basicCompleted || isOtherChosen}
                                className={`
                                    px-6 py-2 rounded-xl text-[12px] font-bold border-2 transition-all duration-300 flex-shrink-0
                                    font-['Orbitron'] tracking-widest uppercase
                                    ${isOtherChosen || !basicCompleted
                                        ? 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed'
                                        : `bg-[#05080f] border-[#3B28F6] text-white
                                            shadow-[0_0_8px_1px_rgba(59,40,246,0.3),inset_0_0_8px_rgba(59,40,246,0.05)]
                                            hover:shadow-[0_0_14px_3px_rgba(59,40,246,0.45),inset_0_0_10px_rgba(59,40,246,0.1)]
                                            hover:border-[#5a47ff] hover:bg-[#080d1a]`
                                    }
                                `}
                            >
                                Start
                            </button>
                    </div>
                </div>
            </div>

            {/* connector line */}
            <div className={`w-[2px] h-8 bg-[#F0F0F0] ${isOtherChosen ? 'opacity-30' : ''}`}></div>

            {/* paths list — sama seperti sebelumnya */}
            <div className={`flex flex-col w-full items-center ${(!basicCompleted || isOtherChosen) ? 'opacity-60 grayscale' : ''}`}>
                {group.paths.map((p: any, idx: number) => {
                    const done = progress.completed_paths?.includes(String(p._id));
                    const badge = badges?.find((b: any) => parseInt(b.order?.toString().trim()) === (idx + 1));

                    let locked = false;
                    if (!basicCompleted) locked = true;
                    if (isOtherChosen) locked = true;
                    if (!locked && idx > 0) {
                        const prevPath = group.paths[idx - 1];
                        locked = !progress.completed_paths?.includes(String(prevPath._id));
                    }

                    return (
                        <div className="flex flex-col items-center w-full" key={String(p._id)}>
                            <StudentModuleNode
                                title={p.name}
                                done={done}
                                locked={locked}
                                index={idx}
                                badge={badge}
                                href={p.modules?.[0]?._id ? `/student/learn/${courseId}/${p._id}/${p.modules[0]._id}` : undefined}
                            />
                            <div className="w-[2px] h-6 bg-gray-500"></div>
                        </div>
                    )
                })}

                {group.paths.length > 0 && (
                    <StudentModuleNode
                        title="Submission"
                        index={group.paths.length}
                        isSubmission={true}
                        locked={
                            !basicCompleted ||
                            isOtherChosen ||
                            !progress.completed_paths?.includes(
                                String(group.paths[group.paths.length - 1]._id)
                            )
                        }
                    />
                )}
            </div>
        </div>
    );
}

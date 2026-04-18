import React from "react";
import StudentModuleNode from "./StudentModuleNode";

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
        <div className="flex flex-col items-center w-full  px-8 sm:px-4 relative  text-sans">
            <div className={`relative w-full rounded-xl flex flex-col p-[2px] shadow-lg mb-0 bg-gradient-to-b from-[#1e2759] to-[#040812] border-2 transition-all 
                 ${isChosen ? 'border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.4)]' : 'border-[#1e2759] shadow-[0_0_20px_rgba(0,0,0,0.5)]'}
                 ${(!basicCompleted || isOtherChosen) ? 'grayscale opacity-50' : ''}
            `}>
                <div className="w-full h-full rounded-lg bg-[#0a0f1d] flex flex-col p-4 relative">

                    {(!basicCompleted || isOtherChosen) && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="#050505" stroke="#1f2937" strokeWidth="1" className="opacity-90 drop-shadow-xl">
                                <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="#050505" strokeWidth="4" />
                                <rect x="4" y="10" width="16" height="12" rx="2" ry="2" />
                                <circle cx="12" cy="16" r="2" fill="#1f2937" />
                                <path d="M12 16v3" stroke="#1f2937" strokeWidth="1" />
                            </svg>
                        </div>
                    )}

                    <div className="flex justify-center mb-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-blue-500 bg-[#3a50d2]">
                            <span className="text-xl text-white">⬢</span>
                        </div>
                    </div>
                    <h2 className="text-sm sm:text-base font-['Orbitron'] font-bold text-center text-white mb-2 uppercase tracking-widest break-words leading-tight">
                        {group.name}
                    </h2>
                    <p className="text-[10px] text-gray-400 text-center mb-3 leading-relaxed px-1">
                        A special package to become a professional {group.name} Developer, starting with modern web fundamentals.
                    </p>

                    <div className="flex justify-between gap-2 mb-3">
                        <div className="flex-1 bg-black/60 border border-[#1e2759] rounded p-1.5 text-center flex flex-col items-center justify-center">
                            <span className="block text-[9px] text-[#eab308]">Modules</span>
                            <span className="block text-[11px] font-bold text-white">{totalModules} Units</span>
                        </div>
                        <div className="flex-1 bg-black/60 border border-[#1e2759] rounded p-1.5 text-center flex flex-col items-center justify-center">
                            <span className="block text-[9px] text-[#eab308]">Formats</span>
                            <span className="block text-[11px] font-bold text-white">Video & project</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-800 flex justify-between items-center bg-[#0a0f1d] relative z-40">
                        <div className="flex items-center gap-1.5 max-w-[65%]">
                            {group.mentor && group.mentor.avatar && group.mentor.avatar !== "null" ? (
                                <img
                                    src={group.mentor.avatar.startsWith('http') ? group.mentor.avatar : `/storage/${group.mentor.avatar}`}
                                    className="w-6 h-6 rounded-full border border-blue-500 object-cover flex-shrink-0"
                                    alt="mentor"
                                />
                            ) : (
                                <div className="relative w-[24px] h-[24px] rounded-full overflow-hidden border border-blue-500 bg-gray-700 flex-shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                                        M
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col text-left truncate">
                                <span className="text-[9px] font-bold text-white leading-none truncate">{group.mentor?.name ?? 'No Mentor'}</span>
                                <span className="text-[7px] text-gray-400 mt-0.5 truncate">{group.mentor ? 'Mentor' : 'Unassigned'}</span>
                            </div>
                        </div>
                        <button
                            disabled={!basicCompleted || isOtherChosen}
                            className={`px-4 py-1 rounded text-[10px] font-bold border transition-colors flex-shrink-0 ${isOtherChosen ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-black border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-black'}`}
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>

            <div className={`w-[2px] h-8 bg-gray-500 ${isOtherChosen ? 'opacity-30' : ''}`}></div>

            <div className={`flex flex-col w-full items-center ${(!basicCompleted || isOtherChosen) ? 'opacity-60 grayscale' : ''}`}>
                {group.paths.map((p: any, idx: number) => {
                    const done = progress.completed_paths?.includes(String(p._id));
                    const badge = badges?.find((b: any) => parseInt(b.order?.toString().trim()) === (idx + 1));

                    let locked = false;

                    // ❌ kalau basic belum selesai → semua lock
                    if (!basicCompleted) {
                        locked = true;
                    }

                    // 🔒 kalau branch lain dipilih
                    if (isOtherChosen) {
                        locked = true;
                    }
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

                {/* Submission at the end */}
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

import ModuleNode from "./ModuleNode"
import { useState } from "react"
import { router } from "@inertiajs/react"

type Module = {
    _id: string
    title: string
    slug: string
}

type Path = {
    _id: string
    name: string
    modules: Module[]
}

type CareerGroup = {
    _id?: string
    name: string
    paths: Path[]
    mentor?: Mentor
}

type Mentor = {
    _id: string
    name: string
    avatar?: string | null
    avatar_url?: string | null
}

type Course = {
    _id: string
    title: string
    slug: string
    description: string
    thumbnail: string
    mentor_id: string
    level: string
    status: string
    is_active: boolean
    published_at: string
    published_by: string
}

type Props = {
    group: CareerGroup
    index: number
    total?: number
    badges: {
        order: number
        icon: string
    }[]
    mentors: Mentor[]
    courseId: string
}

export default function CareerBranch({ group, index, badges, mentors, courseId }: Props) {
    const getBadge = (idx: number) => {
        return (
            badges.find(b => b.order === idx + 1) ||
            badges[badges.length - 1]
        )
    }

    const [showModal, setShowModal] = useState(false)
    const [selectedMentor, setSelectedMentor] = useState("")

    // Total modules across all paths in this group
    const totalModules = (group.paths || []).reduce((sum: number, p: any) => sum + (p.modules?.length || 0), 0);

    return (
        <>
            <div className="flex flex-col items-center w-full max-w-[340px] px-4 relative z-10 transition-all font-sans text-white">

                {/* Header Card */}
                <div 
                    className="relative w-full overflow-hidden rounded-xl border-2 border-[#3B28F6] shadow-[0_0_35px_6px_rgba(59,40,246,0.4)]"
                >
                    {/* TOP ACCENT LINE */}
                    <div className="absolute top-0 right-0 left-0 z-10 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                    <div className="w-full h-full rounded-xl bg-[#050619] flex flex-col p-5">
                        
                        {/* THUMBNAIL CIRCLE */}
                        <div className="mb-4 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 scale-110 rounded-full blur-md bg-blue-500/20" />
                                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] bg-blue-50 dark:bg-[#0b1333]">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-blue-400">
                                        <path d="M12 2C12 2 7 6 7 13l2 2c0-4 1.5-7 3-9 1.5 2 3 5 3 9l2-2c0-7-5-11-5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                        <path d="M9 15l-2 4 3-1M15 15l2 4-3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 
                            className="mb-2 text-center font-['Orbitron'] text-sm sm:text-base font-bold uppercase leading-tight tracking-widest text-white"
                        >
                            {group.name}
                        </h2>

                        <p className="mb-4 text-center text-[10px] text-slate-400 leading-relaxed font-sans">
                            A special package to become a professional {group.name} Developer, starting with modern web development fundamentals.
                        </p>

                        <div className="mb-4 flex justify-between gap-2">
                            <div className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-lg border border-[#1A2E99] bg-[#020101] p-2 text-center">
                                <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#F0E427]">
                                    Learning Path
                                </span>
                                <span className="block text-xs font-bold text-[#B3B3B3]">
                                    {totalModules} Units
                                </span>
                            </div>
                        </div>

                        <div className="relative z-45 flex items-center justify-between border-t border-[#1A2E99]/85 pt-3 mt-auto">
                            {/* MENTOR */}
                            {group.mentor ? (
                                <div className="flex max-w-[65%] items-center gap-2">
                                    {group.mentor.avatar_url ? (
                                        <img
                                            src={group.mentor.avatar_url}
                                            className="h-8 w-8 shrink-0 rounded-full border border-slate-500 object-cover shadow-sm"
                                            alt="mentor"
                                        />
                                    ) : (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-650">
                                            <span className="text-[10px] font-bold text-white">
                                                {group.mentor.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col truncate">
                                        <span className="truncate text-[9.5px] font-bold leading-none text-[#F0F0F0]">
                                            {group.mentor.name}
                                        </span>
                                        <span className="mt-0.5 truncate text-[7.5px] text-gray-500">
                                            Mentor Assigned
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex max-w-[65%] items-center gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-900 bg-slate-800">
                                        <span className="text-xs text-gray-400">?</span>
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="truncate text-[9.5px] font-bold leading-none text-gray-400">
                                            No Mentor
                                        </span>
                                        <span className="mt-0.5 truncate text-[7.5px] text-gray-650">
                                            Unassigned
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowModal(true)}
                                className="shrink-0 rounded-lg border-2 border-indigo-400 bg-indigo-500/10 px-3 py-1 font-['Orbitron'] text-[10px] font-bold uppercase tracking-wider text-indigo-300 shadow-[0_0_8px_1px_rgba(99,102,241,0.2)] hover:bg-indigo-500 hover:text-white transition-all duration-300"
                            >
                                Manage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Connecting Pipe Drop to modules */}
                <div className="w-[2px] h-8 bg-blue-500/70"></div>

                {/* Module Nodes List */}
                <div className="flex flex-col w-full items-center">
                    {(group.paths ?? []).map((path, pIdx) => (
                        <ModuleNode
                            key={path._id}
                            title={path.name}
                            index={pIdx}
                            isLast={false} // So it shows pipe below
                            badge={getBadge(pIdx)} // 🔥 FIX
                            pathId={path._id}
                        />
                    ))}
                </div>

                {/* Submission node */}
                <ModuleNode
                    key={`submission-${index}`}
                    title="Submission"
                    index={group.paths ? group.paths.length : 10}
                    isLast={true}
                    isSubmission={true}
                />

            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#0a0f1d] border border-blue-500 rounded-xl p-6 w-[300px] space-y-4">

                        <h2 className="text-white text-sm font-bold text-center">
                            Assign Mentor
                        </h2>

                        <select
                            className="w-full p-2 bg-slate-800 rounded text-white"
                            onChange={(e) => setSelectedMentor(e.target.value)}
                        >
                            <option value="">Select Mentor</option>
                            {(mentors ?? []).map((m) => (
                                <option key={m._id} value={m._id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 bg-gray-700 rounded text-xs"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!selectedMentor) return;
                                    router.post(`/admin/career-groups/${group._id}/assign-mentor`, {
                                        mentor_id: selectedMentor
                                    }, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setShowModal(false);
                                            setSelectedMentor("");
                                        }
                                    })
                                }}
                                className="px-3 py-1 bg-blue-600 rounded text-xs"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

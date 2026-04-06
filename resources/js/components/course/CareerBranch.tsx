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

    return (
        <>
            <div className="flex flex-col items-center w-full max-w-[320px] px-2 relative z-10">

                {/* Header Card */}
                <div className="relative w-full rounded-xl flex flex-col p-[2px] shadow-lg mb-0 bg-gradient-to-b from-[#1e2759] to-[#040812] border-2 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]">

                    <div className="w-full h-full rounded-lg bg-[#0a0f1d] flex flex-col p-4">
                        <div className="flex justify-center mb-2">
                            {/* Fake Icon */}
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-blue-500 bg-[#3a50d2]">
                                <span className="text-xl text-white">⬢</span>
                            </div>
                        </div>

                        <h2 className="text-sm sm:text-base font-['Orbitron'] font-bold text-center text-white mb-2 uppercase tracking-widest break-words leading-tight">
                            {group.name}
                        </h2>

                        <p className="text-[10px] text-gray-400 text-center mb-3 leading-relaxed">
                            A special package to become a professional {group.name} Developer, starting with modern web fundamentals.
                        </p>

                        <div className="flex justify-between gap-2 mb-3">
                            <div className="flex-1 bg-black/60 border border-[#1e2759] rounded p-1.5 text-center flex flex-col items-center justify-center">
                                <span className="block text-[9px] text-[#eab308]">Modules</span>
                                <span className="block text-[11px] font-bold text-white">10 Units</span>
                            </div>
                            <div className="flex-1 bg-black/60 border border-[#1e2759] rounded p-1.5 text-center flex flex-col items-center justify-center">
                                <span className="block text-[9px] text-[#eab308]">Formats</span>
                                <span className="block text-[11px] font-bold text-white">Video & project</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-800 flex justify-between items-center bg-[#0a0f1d]">
                            <div className="flex items-center gap-1.5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">

                                        {/* Avatar */}
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-blue-500 bg-gray-700">
                                            {group.mentor?.avatar ? (
                                                <img
                                                    src={`/storage/${group.mentor.avatar}`}
                                                    className="w-full h-full object-cover"
                                                    alt={group.mentor.name}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                                                    {group.mentor?.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-white leading-none">
                                                {group.mentor?.name || "No Mentor"}
                                            </span>
                                            <span className="text-[7px] text-gray-400">
                                                {group.mentor ? "Mentor" : "Unassigned"}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-3 py-1 rounded text-[10px] font-bold bg-black border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                            >
                                Manage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Connecting Pipe Drop to modules */}
                <div className="w-[2px] h-8 bg-gray-300"></div>

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
                                    router.post(`/admin/career-groups/${group._id}/assign-mentor`, {
                                        mentor_id: selectedMentor
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

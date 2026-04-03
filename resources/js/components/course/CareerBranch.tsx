import ModuleNode from "./ModuleNode"

type Module = {
    _id: string
    title: string
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
}

type Props = {
    group: CareerGroup
    index: number
    total?: number
    badges: {
        order: number
        icon: string
    }[]
}

export default function CareerBranch({ group, index, badges }: Props) {
    const getBadge = (idx: number) => {
        return (
            badges.find(b => b.order === idx + 1) ||
            badges[badges.length - 1]
        )
    }
    return (
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
                            <div className="w-5 h-5 rounded-full bg-gray-600"></div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-white leading-none">Sensei</span>
                                <span className="text-[7px] text-gray-400">Master</span>
                            </div>
                        </div>
                        <button className="px-3 py-1 rounded text-[10px] font-bold bg-black border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
                            Manage
                        </button>
                    </div>
                </div>
            </div>

            {/* Connecting Pipe Drop to modules */}
            <div className="w-[2px] h-8 bg-gray-300"></div>

            {/* Module Nodes List */}
            <div className="flex flex-col w-full items-center">
                {group.paths?.map((path, pIdx) => (
                    <ModuleNode
                        key={path._id}
                        title={path.name}
                        index={pIdx}
                        isLast={false} // So it shows pipe below
                        badge={getBadge(pIdx)} // 🔥 FIX
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
    )
}
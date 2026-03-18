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
    name: string
    paths: Path[]
}

export default function CareerBranch({ group }: { group: CareerGroup }) {

    return (

        <div className="flex flex-col items-center w-full max-w-xs">

            {/* HEADER */}

            <div className="
                w-full
                rounded-xl
                border border-indigo-500/40
                bg-indigo-50 dark:bg-indigo-950/40
                px-6 py-4
                text-center
                shadow-sm
            ">

                <h2 className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                    {group.name}
                </h2>

            </div>

            {/* CONNECTOR */}

            <div className="w-px h-10 bg-gray-300 dark:bg-gray-700"></div>

            {/* MODULE LIST */}

            <div className="flex flex-col gap-4 w-full">

                {group.paths.map(path => (

                    <ModuleNode
                        key={path._id}
                        title={path.name}
                    />

                ))}

            </div>

        </div>

    )

}
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

        <div className="flex flex-col items-center">

            <div className="w-80 p-6 rounded-xl border border-indigo-500 bg-indigo-900/20 backdrop-blur text-center shadow-xl">

                <h2 className="text-lg font-bold text-indigo-200">
                    {group.name}
                </h2>

            </div>

            <div className="w-px h-10 bg-gray-500 mt-2"></div>

            <div className="flex flex-col space-y-4">

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
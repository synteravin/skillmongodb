type Props = {
    title: string
}

export default function ModuleNode({ title }: Props) {

    return (

        <div className="w-80 p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">

            {title}

        </div>

    )

}
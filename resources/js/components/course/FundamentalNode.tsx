type Props = {
    title: string
    index: number
}

export default function FundamentalNode({ title }: Props) {

    return (

        <div className="flex flex-col items-center">

            <div className="w-72 p-4 rounded-lg border border-indigo-500 bg-indigo-900/20 backdrop-blur text-center shadow-lg">

                <h3 className="font-semibold text-indigo-200">
                    {title}
                </h3>

            </div>

            <div className="w-px h-10 bg-gray-500 mt-2"></div>

        </div>

    )

}
import AppLayout from "@/layouts/app-layout"
import { router } from "@inertiajs/react"

type Quiz = {
    id: string
    module_name: string
    difficulty: string
    questions_count: number
}

export default function Index({ quizzes }: { quizzes: Quiz[] }) {
    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Quiz Management
                </h1>

                <div className="grid gap-4">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="border p-4 rounded-xl flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-semibold">
                                    {quiz.module_name}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Difficulty: {quiz.difficulty}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Questions: {quiz.questions_count}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        router.get(`/admin/quiz/${quiz.id}/edit`)
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm("Delete quiz?")) {
                                            router.delete(`/admin/quiz/${quiz.id}`)
                                        }
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
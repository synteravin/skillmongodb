import { Link, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Pencil, Trash2 } from "lucide-react"

type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string | null
    slug: string
}

export default function Index({ courses }: { courses: Course[] }) {

    function deleteCourse(slug: string) {
        if (!confirm("Delete this course?")) return
        router.delete(`/admin/courses/${slug}`)
    }

    return (

        <AppLayout>

            <div className="p-8 max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
                            Courses
                        </h1>

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Manage your courses, add new ones, or edit existing courses.
                        </p>
                    </div>

                    <Link
                        href="/admin/courses/create"
                        className="px-5 py-2 rounded-lg 
                        bg-indigo-600 dark:bg-indigo-500 
                        text-white 
                        border border-indigo-600 dark:border-indigo-500"
                    >
                        Create Course
                    </Link>

                </div>

                {/* COURSE GRID */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {courses.map((course) => (

                        <div
                            key={course._id}
                            className="rounded-xl border 
                            border-gray-200 dark:border-slate-700 
                            bg-white dark:bg-slate-900 
                            overflow-hidden shadow-sm"
                        >

                            {/* THUMBNAIL */}
                            <Link href={`/admin/courses/${course.slug}`}>
                                <div className="aspect-video bg-gray-100 dark:bg-slate-800 flex items-center justify-center">

                                    {course.thumbnail ? (
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            No Thumbnail
                                        </span>
                                    )}

                                </div>
                            </Link>

                            {/* CONTENT */}
                            <div className="p-4">

                                <Link href={`/admin/courses/${course.slug}`}>
                                    <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                                        {course.title}
                                    </h2>
                                </Link>

                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                                    {course.description}
                                </p>

                                {/* ACTIONS */}
                                <div className="flex items-center justify-between mt-4">

                                    <Link
                                        href={`/admin/courses/${course.slug}`}
                                        className="text-sm text-indigo-600 dark:text-indigo-400"
                                    >
                                        Open Builder
                                    </Link>

                                    <div className="flex gap-2">

                                        <Link
                                            href={`/admin/courses/${course.slug}/edit`}
                                            className="p-2 rounded-md 
                                            border border-gray-200 dark:border-slate-700 
                                            text-gray-600 dark:text-slate-300"
                                        >
                                            <Pencil size={16} />
                                        </Link>

                                        <button
                                            onClick={() => deleteCourse(course.slug)}
                                            className="p-2 rounded-md 
                                            border border-gray-200 dark:border-slate-700 
                                            text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* EMPTY STATE */}
                {courses.length === 0 && (

                    <div className="mt-16 text-center">

                        <p className="text-gray-500 dark:text-slate-400">
                            No courses created yet
                        </p>

                        <Link
                            href="/admin/courses/create"
                            className="inline-block mt-4 px-5 py-2 rounded-lg 
                            bg-indigo-600 dark:bg-indigo-500 
                            text-white"
                        >
                            Create Your First Course
                        </Link>

                    </div>

                )}

            </div>

        </AppLayout>

    )

}
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
                        <h1 className="text-3xl font-bold tracking-tight">
                            Courses
                        </h1>

                        <p className="text-sm text-gray-500">
                            Manage and build your learning courses
                        </p>
                    </div>

                    <Link
                        href="/admin/courses/create"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        + Create Course
                    </Link>

                </div>


                {/* COURSE GRID */}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {courses.map((course) => (

                        <div
                            key={course._id}
                            className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
                        >

                            {/* THUMBNAIL */}

                            <Link href={`/admin/courses/${course.slug}`}>

                                <div className="aspect-video bg-gray-100 overflow-hidden">

                                    {course.thumbnail ? (

                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                            No Thumbnail
                                        </div>

                                    )}

                                </div>

                            </Link>


                            {/* CONTENT */}

                            <div className="relative z-10 p-4">

                                <Link href={`/admin/courses/${course.slug}`}>

                                    <h2 className="font-semibold text-lg leading-tight group-hover:text-indigo-600 transition">

                                        {course.title}

                                    </h2>

                                </Link>

                                <p className="text-xs text-gray-500 mt-1">
                                    {course.description}
                                </p>


                                {/* ACTIONS */}

                                <div className="flex items-center justify-between mt-4">

                                    <Link
                                        href={`/admin/courses/${course.slug}`}
                                        className="text-sm text-indigo-600 font-medium hover:underline"
                                    >
                                        Open Builder →
                                    </Link>

                                    <div className="flex gap-2">

                                        <Link
                                            href={`/admin/courses/${course.slug}/edit`}
                                            className="p-2 rounded hover:bg-gray-100"
                                        >
                                            <Pencil size={16} />
                                        </Link>

                                        <button
                                            onClick={() => deleteCourse(course.slug)}
                                            className="p-2 rounded hover:bg-red-100 text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* HOVER GLOW */}

                            <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-indigo-200 transition pointer-events-none"></div>

                        </div>

                    ))}

                </div>


                {/* EMPTY STATE */}

                {courses.length === 0 && (

                    <div className="mt-16 text-center">

                        <p className="text-gray-500">
                            No courses created yet
                        </p>

                        <Link
                            href="/admin/courses/create"
                            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                            Create Your First Course
                        </Link>

                    </div>

                )}

            </div>

        </AppLayout>

    )

}
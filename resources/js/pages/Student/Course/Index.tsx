import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, Lock } from 'lucide-react'

type Course = {
    _id: string
    title: string
    description: string
    thumbnail: string
    slug: string
    status?: 'locked' | 'active' | 'completed' | null
}

export default function Index({ courses }: { courses: Course[] }) {
    return (
        <>
            <Head title="My Courses" />

            <div className="min-h-screen bg-[#040812] text-slate-200 font-sans pb-16">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

                    {/* Header */}
                    <div className="relative mb-5 w-full">
                        <div className="border-[3px] border-[#1e2759] rounded-xl p-[2px] bg-gradient-to-b from-[#0a0f1d] to-[#040812] shadow-lg">
                            <div className="border-2 border-yellow-500/80 rounded-lg py-5 px-4 md:px-6 flex items-center relative bg-[#040812]">

                                <Link
                                    href="/student/dashboard"
                                    className="border-2 border-blue-800 rounded bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition w-10 h-10 md:w-12 md:h-12 absolute left-4 md:left-6"
                                >
                                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                </Link>

                                <h1 className="w-full text-center text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-widest uppercase">
                                    SELECT YOUR COURSE
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {courses.map((course) => {

                            const isLocked = course.status === 'locked'
                            const isActive = course.status === 'active'
                            const isCompleted = course.status === 'completed'

                            return (
                                <div
                                    key={course._id}
                                    onClick={() => {
                                        if (isLocked) return

                                        router.post('/student/courses/select', {
                                            course_id: course._id,
                                            slug: course.slug
                                        })
                                    }}
                                    className={`
                                        cursor-pointer group flex flex-col rounded-xl overflow-hidden relative transition-all duration-500
                                        bg-[#0b1021] border

                                        ${isLocked && 'opacity-40 pointer-events-none border-gray-700'}
                                        ${isActive && 'border-green-500 scale-[1.03] shadow-[0_0_25px_rgba(34,197,94,0.4)]'}
                                        ${isCompleted && 'border-blue-500'}
                                        ${!course.status && 'border-[#1e2759] hover:border-blue-500/60'}
                                    `}
                                >

                                    {/* LOCK ICON */}
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                            <Lock className="w-10 h-10 text-white opacity-80" />
                                        </div>
                                    )}

                                    {/* Thumbnail */}
                                    <div className="w-full h-full md:h-56 flex items-center justify-center bg-slate-900 border-b border-[#1e2759]/50">
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            alt={course.title}
                                            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1 z-10">
                                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">
                                            {course.title}
                                        </h2>

                                        <p className="text-sm text-slate-400 line-clamp-3 mb-8">
                                            {course.description}
                                        </p>

                                        {/* Button */}
                                        <div className="mt-auto">
                                            <div className={`
                                                w-full py-2.5 rounded-md border font-bold text-sm text-center transition-all

                                                ${isActive && 'bg-green-500 text-black border-green-500'}
                                                ${isCompleted && 'bg-blue-500 text-white border-blue-500'}
                                                ${isLocked && 'bg-gray-600 text-gray-300 border-gray-600'}
                                                ${!course.status && 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'}
                                            `}>
                                                {isActive && 'Sedang Dimainkan'}
                                                {isCompleted && 'Selesai (Ulangi)'}
                                                {isLocked && 'Terkunci'}
                                                {!course.status && 'Mulai Belajar →'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Empty */}
                    {courses.length === 0 && (
                        <div className="text-center text-slate-500 mt-20 text-xl tracking-wider">
                            BELUM ADA COURSE TERSEDIA.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
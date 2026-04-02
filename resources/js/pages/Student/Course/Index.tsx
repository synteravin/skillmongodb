import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Course = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
};

export default function Index({ courses }: { courses: Course[] }) {
    return (
        <>
            <Head title="My Courses" />

            <div className="min-h-screen bg-[#040812] text-slate-200 font-sans pb-16">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="relative mb-5 w-full">
                        {/* Frame wrapper to match the exact aesthetic */}
                        <div className="border-[3px] border-[#1e2759] rounded-xl p-[2px] bg-gradient-to-b from-[#0a0f1d] to-[#040812] shadow-lg">
                            <div className="border-2 border-yellow-500/80 rounded-lg py-5 px-4 md:px-6 flex items-center relative shadow-[inset_0_0_15px_rgba(234,179,8,0.05)] bg-[#040812]">
                                {/* Back Button */}
                                <Link
                                    href="/student/dashboard"
                                    className="border-2 border-blue-800 rounded bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 absolute left-4 md:left-6 z-10"
                                >
                                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                </Link>

                                {/* Title */}
                                <h1 className="w-full text-center text-xl md:text-2xl lg:text-3xl font-['Orbitron'] font-bold text-white tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase">
                                    SELECT YOUR COURSE
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <Link
                                key={course._id}
                                href={`/student/course/${course.slug}`}
                                className="group flex flex-col bg-[#0b1021] border border-[#1e2759] hover:border-blue-500/60 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(30,58,138,0.3)] relative"
                            >
                                {/* Thumbnail */}
                                <div className="w-full h-full md:h-56 flex items-center justify-center bg-slate-900 border-b border-[#1e2759]/50">
                                    <img
                                        src={`/storage/${course.thumbnail}`}
                                        alt={course.title}
                                        className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1 z-10">
                                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h2>

                                    <p className="text-sm text-slate-400 line-clamp-3 mb-8 leading-relaxed">
                                        {course.description}
                                    </p>

                                    {/* Button */}
                                    <div className="mt-auto">
                                        <div className={`w-full py-2.5 rounded-md border font-bold text-sm tracking-wide transition-all duration-300 text-center 'bg-yellow-500 text-[#090d19] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-[#090d19] group-hover:bg-yellow-500 group-hover:text-[#090d19] shadow-[0_0_10px_rgba(234,179,8,0.1)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]'}`}>
                                            Mulai Belajar →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {courses.length === 0 && (
                        <div className="text-center text-slate-500 mt-20 font-['Orbitron'] text-xl tracking-wider">
                            BELUM ADA COURSE TERSEDIA.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
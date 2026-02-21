import AppLayout from '@/layouts/app-layout';
import { BookOpen, Users, Activity, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ mentor }: any) {
    const courses = mentor?.courses ?? [];

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* HEADER */}
                    <header>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Mentor Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Welcome back,{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {mentor.name}
                            </span>
                            . Here are your assigned courses.
                        </p>
                    </header>

                    {/* STATS */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Stat
                            title="Assigned Courses"
                            value={mentor.stats.courses}
                            icon={BookOpen}
                        />
                        <Stat
                            title="Total Students"
                            value={mentor.stats.students}
                            icon={Users}
                        />
                        <Stat
                            title="Active Students"
                            value={mentor.stats.active}
                            icon={Activity}
                        />
                        <Stat
                            title="Avg Progress"
                            value={`${mentor.stats.progress}%`}
                            icon={Activity}
                        />
                    </section>

                    {/* COURSES */}
                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                            My Courses
                        </h2>

                        {courses.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    You are not assigned to any course yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course: any) => (
                                    <div
                                        key={course.id}
                                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {course.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {course.students} students enrolled
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                Progress Avg: {course.progress}%
                                            </span>

                                            <Link
                                                href={`/mentor/courses/${course.id}`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                                            >
                                                Manage
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

/* ---------- Stat Component ---------- */
function Stat({ title, value, icon: Icon }: any) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

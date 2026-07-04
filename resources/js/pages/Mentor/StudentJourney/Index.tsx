import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Clock, Star } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    progressPercent: number;
    averageScore: number;
    status: string;
    lastActivity: string | null;
}

interface Statistics {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
}

interface Props {
    statistics: Statistics;
    students: Student[];
}

export default function StudentJourneyIndex({ statistics, students }: Props) {
    return (
        <AppLayout>
            <Head title="Student Journey" />

            <div
                className="min-h-screen bg-slate-50/50 pt-8 pb-20 dark:bg-[#090910]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header & Stats Container */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 sm:p-8 bg-[#f5f6ff] dark:bg-[#0d0f17] dark:border-slate-800 shadow-sm shadow-slate-100/50 mb-6">
                        {/* Grid Pattern Motif */}
                        <div 
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 z-0" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Student Journey
                                </span>
                                <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                                    Student Tracking
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                                    Manage and track student progress and performance across learning branches.
                                </p>
                            </div>

                            {/* Compact Stats */}
                            <div className="relative flex overflow-hidden rounded-xl border border-slate-200 bg-white/90 text-sm dark:border-slate-800 dark:bg-slate-900/90 shadow-xs shrink-0 self-start sm:self-center">
                                <div className="border-r border-slate-200 px-4 py-2.5 dark:border-slate-800">
                                    <span className="text-slate-500 dark:text-slate-400/60 font-medium">Total:</span>{' '}
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {statistics.totalStudents}
                                    </span>
                                </div>
                                <div className="border-r border-slate-200 px-4 py-2.5 dark:border-slate-800">
                                    <span className="text-slate-500 dark:text-slate-400/60 font-medium">Active:</span>{' '}
                                    <span className="font-bold text-emerald-600 dark:text-emerald-450">
                                        {statistics.activeStudents}
                                    </span>
                                </div>
                                <div className="px-4 py-2.5">
                                    <span className="text-slate-500 dark:text-slate-400/60 font-medium">
                                        Completed:
                                    </span>{' '}
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        {statistics.completedStudents}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Table */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400/60">
                                <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/30">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                            Student
                                        </th>
                                        <th className="w-48 px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                            Progress
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                            Avg Score
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                            Last Active
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {students.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {/* Unboxed Avatar */}
                                                    <img
                                                        src={
                                                            student.avatar ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`
                                                        }
                                                        alt={student.name}
                                                        className="h-10 w-auto object-contain"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-white">
                                                            {student.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400/60">
                                                            ID:{' '}
                                                            {student.id.substring(
                                                                0,
                                                                6,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className="h-full rounded-full bg-indigo-500"
                                                            style={{
                                                                width: `${student.progressPercent}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-8 text-right text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        {
                                                            student.progressPercent
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-white">
                                                    <Star
                                                        size={14}
                                                        className="fill-amber-500 text-amber-500"
                                                    />
                                                    {student.averageScore}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400/60">
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />{' '}
                                                    {student.lastActivity ||
                                                        'Never'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/mentor/student-journey/${student.id}`}
                                                    className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                                >
                                                    <ChevronRight size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="p-12 text-center text-sm text-slate-500 dark:text-slate-400/60"
                                            >
                                                No students enrolled yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
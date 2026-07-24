import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    X,
    Star,
    Users,
    GraduationCap,
    Trophy,
    ChevronRight,
    ArrowUpDown,
    Sparkles,
    SearchX,
} from 'lucide-react';

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    progressPercent: number;
    averageScore: number;
    status: string;
    lastActivity?: string | null;
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

export default function StudentJourneyIndex({ statistics, students = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
    const [sortBy, setSortBy] = useState<'progress' | 'score' | 'name'>('progress');

    // Calculate average score across all students
    const overallAvgScore = useMemo(() => {
        if (!students || students.length === 0) return 0;
        const total = students.reduce((acc, s) => acc + (s.averageScore || 0), 0);
        return (total / students.length).toFixed(1);
    }, [students]);

    // Filter & Sort logic
    const filteredStudents = useMemo(() => {
        return students
            .filter((student) => {
                // Search filter
                const matchesSearch =
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.id.toLowerCase().includes(searchQuery.toLowerCase());

                // Status filter
                let matchesStatus = true;
                if (statusFilter === 'completed') {
                    matchesStatus = student.status === 'completed';
                } else if (statusFilter === 'in_progress') {
                    matchesStatus = student.status === 'active' || student.status === 'in_progress';
                }

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'progress') {
                    return b.progressPercent - a.progressPercent;
                }
                if (sortBy === 'score') {
                    return b.averageScore - a.averageScore;
                }
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                }
                return 0;
            });
    }, [students, searchQuery, statusFilter, sortBy]);

    return (
        <AppLayout>
            <Head title="Student Journey" />

            <div
                className="min-h-screen bg-slate-50/50 pt-6 pb-20 dark:bg-[#090910]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header & Stats Banner */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#f8f9ff] via-[#f0f2fe] to-[#e8ebff] p-6 shadow-md shadow-indigo-100/50 sm:p-8 dark:border-slate-800/80 dark:from-[#0d0f17] dark:via-[#111424] dark:to-[#0a0c14] dark:shadow-none">
                        {/* Grid Pattern Background Motif */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(79, 70, 229, 0.15) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(79, 70, 229, 0.15) 1px, transparent 1px)
                                `,
                                backgroundSize: '32px 32px',
                            }}
                        />

                        {/* Top Ambient Glow Accent */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            {/* Title & Description */}
                            <div className="max-w-xl space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-bold text-indigo-700 backdrop-blur-md dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-300">
                                    <Sparkles size={13} className="text-amber-500" />
                                    <span className="font-['Orbitron'] tracking-wider uppercase text-[10px]">
                                        STUDENT JOURNEY TRACKING
                                    </span>
                                </div>
                                <h1 className="font-['Orbitron'] text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Student Journey
                                </h1>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    Pantau statistik perkembangan, nilai rata-rata kuis, dan progres pembelajaran siswa.
                                </p>
                            </div>

                            {/* 3 Stat Metric Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                {/* Total Siswa */}
                                <div className="group rounded-xl border border-slate-200/80 bg-white/80 p-3.5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-indigo-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Total Siswa
                                            </p>
                                            <p className="font-['Orbitron'] text-lg font-black text-slate-900 dark:text-white">
                                                {statistics.totalStudents}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selesai */}
                                <div className="group rounded-xl border border-slate-200/80 bg-white/80 p-3.5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-violet-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                            <GraduationCap size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Selesai
                                            </p>
                                            <p className="font-['Orbitron'] text-lg font-black text-violet-600 dark:text-violet-400">
                                                {statistics.completedStudents}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rata-rata Skor */}
                                <div className="group rounded-xl border border-slate-200/80 bg-white/80 p-3.5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                            <Trophy size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Avg Score
                                            </p>
                                            <p className="font-['Orbitron'] text-lg font-black text-amber-600 dark:text-amber-400">
                                                {overallAvgScore}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search, Filter & Sort Bar */}
                    <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0d0f17]">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Controls: Filter Pills & Sort Selector */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Pills */}
                            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                                        statusFilter === 'all'
                                            ? 'bg-white text-indigo-600 shadow-xs dark:bg-indigo-600 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    Semua ({students.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('in_progress')}
                                    className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                                        statusFilter === 'in_progress'
                                            ? 'bg-white text-emerald-600 shadow-xs dark:bg-emerald-600 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    Sedang Belajar ({students.length - statistics.completedStudents})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('completed')}
                                    className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                                        statusFilter === 'completed'
                                            ? 'bg-white text-violet-600 shadow-xs dark:bg-violet-600 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    Selesai ({statistics.completedStudents})
                                </button>
                            </div>

                            {/* Sort Selector */}
                            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                                <ArrowUpDown size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Urut:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    aria-label="Urutkan daftar siswa"
                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer dark:text-slate-200"
                                >
                                    <option value="progress" className="dark:bg-slate-900">Progress Highest</option>
                                    <option value="score" className="dark:bg-slate-900">Score Highest</option>
                                    <option value="name" className="dark:bg-slate-900">Nama (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Streamlined Table Container */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-md shadow-slate-100/50 dark:border-slate-800/80 dark:shadow-none">
                        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0d0f17] dark:to-[#08090f]" />
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent dark:via-indigo-500/20" />

                        <div className="relative z-10 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                {/* Table Header */}
                                <thead>
                                    <tr className="border-b border-slate-200/80 bg-slate-100/60 font-['Orbitron'] text-[10px] tracking-wider text-slate-500 uppercase dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-400">
                                        <th className="px-6 py-4 font-extrabold">
                                            STUDENT
                                        </th>
                                        <th className="w-56 px-6 py-4 font-extrabold">
                                            PROGRESS
                                        </th>
                                        <th className="px-6 py-4 font-extrabold">
                                            AVG SCORE
                                        </th>
                                        <th className="px-6 py-4 font-extrabold">
                                            STATUS
                                        </th>
                                        <th className="px-6 py-4 text-right font-extrabold">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {filteredStudents.map((student) => {
                                        const isCompleted = student.status === 'completed';

                                        return (
                                            <tr
                                                key={student.id}
                                                className="group transition-all duration-200 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20"
                                            >
                                                {/* 1. Student Info Column */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                student.avatar ||
                                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4f46e5&color=fff`
                                                            }
                                                            alt={student.name}
                                                            className="h-10 w-10 shrink-0 rounded-full border-2 border-indigo-200/80 object-cover shadow-xs transition duration-300 group-hover:border-indigo-500 dark:border-indigo-900/60"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 truncate">
                                                                {student.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 2. Progress Column */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                                {student.progressPercent}%
                                                            </span>
                                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                                {student.progressPercent >= 80
                                                                    ? 'Mastery'
                                                                    : student.progressPercent >= 40
                                                                    ? 'Advanced'
                                                                    : 'Basic'}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${
                                                                    student.progressPercent >= 80
                                                                        ? 'bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-xs shadow-emerald-500/50'
                                                                        : student.progressPercent >= 40
                                                                        ? 'bg-gradient-to-r from-indigo-500 to-amber-500'
                                                                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                                                                }`}
                                                                style={{
                                                                    width: `${Math.min(100, Math.max(0, student.progressPercent))}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 3. Avg Score Column */}
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 backdrop-blur-xs font-['Orbitron'] text-xs font-bold transition-all ${
                                                        student.averageScore >= 85
                                                            ? 'border-amber-400/40 bg-amber-50/80 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400'
                                                            : student.averageScore >= 70
                                                            ? 'border-indigo-400/40 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300'
                                                            : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                                    }">
                                                        <Star
                                                            size={13}
                                                            className={
                                                                student.averageScore >= 85
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : student.averageScore >= 70
                                                                    ? 'fill-indigo-400 text-indigo-400'
                                                                    : 'text-slate-400'
                                                            }
                                                        />
                                                        <span>{student.averageScore}</span>
                                                    </div>
                                                </td>

                                                {/* 4. Status Column */}
                                                <td className="px-6 py-4">
                                                    {isCompleted ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                                            Selesai
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Sedang Belajar
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 5. Action Column */}
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/mentor/student-journey/${student.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-600 shadow-xs transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white"
                                                    >
                                                        <span>Lihat Journey</span>
                                                        <ChevronRight size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Empty State */}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center">
                                                <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 shadow-inner dark:border-slate-800 dark:bg-slate-900">
                                                        <SearchX size={24} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-['Orbitron'] text-sm font-bold text-slate-800 dark:text-white">
                                                            Siswa Tidak Ditemukan
                                                        </h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {searchQuery
                                                                ? `Tidak ada siswa yang cocok dengan pencarian "${searchQuery}".`
                                                                : 'Belum ada siswa terdaftar pada kriteria ini.'}
                                                        </p>
                                                    </div>
                                                    {(searchQuery || statusFilter !== 'all') && (
                                                        <button
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setStatusFilter('all');
                                                            }}
                                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900"
                                                        >
                                                            Reset Filter
                                                        </button>
                                                    )}
                                                </div>
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

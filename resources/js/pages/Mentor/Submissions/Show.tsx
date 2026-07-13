import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    Users,
    ChevronRight,
    Search,
    Inbox,
    ChevronDown,
} from 'lucide-react';
import { useState, useMemo } from 'react';

type Submission = {
    id: string;
    group_id?: string;
    title: string;
    description: string;
    deadline: string;
    status: 'draft' | 'published';
};

type StudentSubmission = {
    id: string;
    student_name: string;
    status: 'submitted' | 'late' | 'graded';
    submitted_at: string;
};

interface Props {
    submission: Submission;
    studentSubmissions: StudentSubmission[];
}

export default function SubmissionShow({
    submission,
    studentSubmissions,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'graded'>(
        'all',
    );
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    const statusBadge = {
        submitted:
            'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-450 border border-amber-200 dark:border-amber-500/20',
        late: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 border border-rose-200 dark:border-rose-500/20',
        graded: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-500/20',
    };

    // Statistik Perhitungan
    const totalCount = studentSubmissions.length;
    const gradedCount = useMemo(
        () => studentSubmissions.filter((s) => s.status === 'graded').length,
        [studentSubmissions],
    );
    const pendingCount = totalCount - gradedCount;
    const completionRate =
        totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0;

    // Filter & Search Logic
    const filteredSubmissions = useMemo(() => {
        return studentSubmissions.filter((item) => {
            // Filter by Search Term
            const matchesSearch = item.student_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // Filter by Status Tab
            let matchesTab = true;
            if (activeTab === 'pending') {
                matchesTab =
                    item.status === 'submitted' || item.status === 'late';
            } else if (activeTab === 'graded') {
                matchesTab = item.status === 'graded';
            }

            return matchesSearch && matchesTab;
        });
    }, [studentSubmissions, searchTerm, activeTab]);

    return (
        <AppLayout>
            <div
                className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {submission.title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Submission Dashboard &bull; Monitor and evaluate
                            student work
                        </p>
                    </div>
                </div>

                {/* Collapsible Assignment Details Card */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-sm shadow-slate-100/50 backdrop-blur-xs dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40">
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                    <button
                        type="button"
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="flex w-full cursor-pointer items-center justify-between p-5 text-left font-bold text-slate-900 transition-colors hover:bg-slate-50/50 dark:text-white dark:hover:bg-slate-900/35"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-slate-550 text-sm font-extrabold tracking-wider uppercase dark:text-slate-400">
                                Assignment Instructions
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                                    submission.status === 'published'
                                        ? 'dark:text-emerald-450 border border-emerald-200/50 bg-emerald-100/50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10'
                                        : 'dark:text-amber-450 border border-amber-200/50 bg-amber-100/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10'
                                }`}
                            >
                                {submission.status}
                            </span>
                        </div>
                        <div className="dark:text-slate-550 flex items-center gap-2 text-slate-400">
                            <span className="text-xs font-semibold">
                                {isDetailsExpanded
                                    ? 'Hide Details'
                                    : 'Show Details'}
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-300 ${isDetailsExpanded ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </button>

                    {isDetailsExpanded && (
                        <div className="space-y-4 border-t border-slate-100 px-5 pt-1 pb-5 dark:border-slate-800/40">
                            <p className="dark:text-slate-355 text-sm leading-relaxed whitespace-pre-line text-slate-600">
                                {submission.description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-1">
                                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
                                    <Calendar className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                                    <span className="text-slate-505 text-[11px] font-semibold dark:text-slate-400">
                                        Deadline:
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                                        {submission.deadline
                                            ? new Date(
                                                  submission.deadline,
                                              ).toLocaleString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : 'Not Set'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Overview Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {/* Card: Total Submissions */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 backdrop-blur-xs dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    Total Submissions
                                </span>
                                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {totalCount}
                                </span>
                            </div>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card: Graded Submissions */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 backdrop-blur-xs dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    Graded Submissions
                                </span>
                                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {gradedCount}
                                </span>
                            </div>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card: Completion Rate */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 backdrop-blur-xs dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    Completion Rate
                                </span>
                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                    {completionRate}%
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Tabel Tugas Siswa */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-sm shadow-slate-100/50 backdrop-blur-xs dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    {/* Header Kontrol: Tab Filter & Cari */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center dark:border-slate-800/60">
                        {/* Tab Filter */}
                        <div className="flex gap-1 border-b border-slate-100 pb-2 md:border-b-0 md:pb-0 dark:border-slate-800/50">
                            {[
                                { key: 'all', label: 'All', count: totalCount },
                                {
                                    key: 'pending',
                                    label: 'Pending Review',
                                    count: pendingCount,
                                },
                                {
                                    key: 'graded',
                                    label: 'Graded',
                                    count: gradedCount,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                        activeTab === tab.key
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60'
                                    }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                                            activeTab === tab.key
                                                ? 'bg-white/20 text-white'
                                                : 'dark:text-slate-450 bg-slate-200 text-slate-600 dark:bg-slate-900'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-100/40 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:ring-1 focus:ring-indigo-500 focus:outline-none md:w-64 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/55 font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800/85 dark:bg-slate-900/40 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        Student
                                    </th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        Evaluation Status
                                    </th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        Submitted At
                                    </th>
                                    <th className="px-6 py-4 text-right whitespace-nowrap">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredSubmissions.length > 0 ? (
                                    filteredSubmissions.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-slate-100/40 dark:hover:bg-slate-900/20"
                                        >
                                            {/* Student Profil */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-extrabold text-white shadow-xs">
                                                        {item.student_name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <span className="font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                        {item.student_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold ${statusBadge[item.status]}`}
                                                >
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                                                    <span className="capitalize">
                                                        {item.status}
                                                    </span>
                                                </span>
                                            </td>

                                            {/* Tanggal Submitted */}
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
                                                {item.submitted_at
                                                    ? new Date(
                                                          item.submitted_at,
                                                      ).toLocaleString(
                                                          'id-ID',
                                                          {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          },
                                                      )
                                                    : '—'}
                                            </td>

                                            {/* Tombol Review */}
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/mentor/student-submissions/${item.id}`}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 font-bold whitespace-nowrap text-indigo-600 transition-all hover:border-indigo-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:border-indigo-900/60"
                                                >
                                                    Evaluate
                                                    <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-fit rounded-full border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                                    <Inbox className="text-slate-350 h-8 w-8 dark:text-slate-600" />
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    {searchTerm
                                                        ? 'No students match your search criteria.'
                                                        : 'No student submissions found in this category.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

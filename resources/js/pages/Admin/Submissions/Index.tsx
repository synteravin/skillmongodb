import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Award,
    Clock,
    ExternalLink,
    FileText,
    Filter,
    GraduationCap,
    Search,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    User as UserIcon,
} from 'lucide-react';

interface StudentData {
    _id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

interface SubmissionDetails {
    _id: string;
    title: string;
    group_name: string;
    mentor_name: string;
}

interface StudentSubmissionItem {
    _id: string;
    id: string;
    slug: string;
    status: 'submitted' | 'graded' | 'late' | string;
    grade?: number | string | null;
    feedback?: string | null;
    file_path?: string | null;
    link?: string | null;
    notes?: string | null;
    certificate_path?: string | null;
    certificate_url?: string | null;
    created_at?: string | null;
    created_at_formatted: string;
    student: StudentData | null;
    submission: SubmissionDetails | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    submissions: PaginatedData<StudentSubmissionItem>;
    filters: {
        status: string;
        search: string;
    };
    counts: {
        all: number;
        submitted: number;
        graded: number;
        late: number;
    };
}

export default function Index({ submissions, filters, counts }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);
    const currentStatus = filters.status || 'all';

    const handleFilterChange = (status: string) => {
        setIsLoading(true);
        router.get(
            '/admin/submissions',
            {
                status,
                search: searchQuery || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(
            '/admin/submissions',
            {
                status: currentStatus !== 'all' ? currentStatus : undefined,
                search: searchQuery || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50/50 px-4 py-6 text-slate-900 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-[#030712] dark:text-white">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0d0f17] dark:via-[#090b12] dark:to-[#07080f]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        Supervisi Kelulusan
                                    </span>
                                </div>
                                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    Monitoring Proyek Kelulusan Siswa
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Pantau pengumpulan proyek akhir cabang karir, status evaluasi mentor, dan sertifikat yang diterbitkan.
                                </p>
                            </div>

                            <Link
                                href="/admin/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                ← Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Status Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    currentStatus === 'all'
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                Semua ({counts.all})
                            </button>
                            <button
                                onClick={() => handleFilterChange('submitted')}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    currentStatus === 'submitted'
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                <Clock className="h-3 w-3" />
                                Menanti Review ({counts.submitted})
                            </button>
                            <button
                                onClick={() => handleFilterChange('graded')}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    currentStatus === 'graded'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                <Award className="h-3 w-3" />
                                Selesai Dinilai ({counts.graded})
                            </button>
                            {counts.late > 0 && (
                                <button
                                    onClick={() => handleFilterChange('late')}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                        currentStatus === 'late'
                                            ? 'bg-rose-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    Terlambat ({counts.late})
                                </button>
                            )}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa atau email..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                            />
                        </form>
                    </div>

                    {/* Table of Submissions */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-[#0c0e17]">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] dark:bg-[#0c0e17]/60">
                                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400">
                                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                                    <span>Memuat data...</span>
                                </div>
                            </div>
                        )}
                        <div className={`overflow-x-auto transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3.5">Siswa</th>
                                        <th className="px-5 py-3.5">Cabang Karir & Proyek</th>
                                        <th className="px-5 py-3.5">Lampiran Proyek</th>
                                        <th className="px-5 py-3.5">Status & Nilai</th>
                                        <th className="px-5 py-3.5">Mentor Evaluator</th>
                                        <th className="px-5 py-3.5">Tanggal Serah</th>
                                        <th className="px-5 py-3.5 text-right">Sertifikat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {submissions.data.length > 0 ? (
                                        submissions.data.map((sub) => (
                                            <tr
                                                key={sub._id}
                                                className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
                                            >
                                                {/* Siswa */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {sub.student?.avatar ? (
                                                            <img
                                                                src={sub.student.avatar}
                                                                alt={sub.student.name}
                                                                className="h-8 w-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                                {sub.student?.name
                                                                    ? sub.student.name.charAt(0).toUpperCase()
                                                                    : 'S'}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="truncate font-bold text-slate-900 dark:text-white">
                                                                {sub.student?.name ?? 'Siswa'}
                                                            </p>
                                                            <p className="truncate text-[11px] text-slate-400">
                                                                {sub.student?.email ?? '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Cabang Karir & Proyek */}
                                                <td className="px-5 py-4">
                                                    <div className="max-w-[220px]">
                                                        <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                                            {sub.submission?.group_name ?? 'Cabang Karir'}
                                                        </span>
                                                        <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                            {sub.submission?.title ?? 'Proyek Akhir'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Lampiran & Link */}
                                                <td className="px-5 py-4">
                                                    <div className="space-y-1">
                                                        {sub.link && (
                                                            <a
                                                                href={sub.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                                Tautan Proyek
                                                            </a>
                                                        )}
                                                        {sub.file_path && (
                                                            <a
                                                                href={`/storage/${sub.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 font-medium text-slate-600 hover:underline dark:text-slate-300"
                                                            >
                                                                <FileText className="h-3 w-3" />
                                                                Berkas Lampiran
                                                            </a>
                                                        )}
                                                        {!sub.link && !sub.file_path && (
                                                            <span className="text-slate-400">-</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status & Nilai */}
                                                <td className="px-5 py-4">
                                                    {sub.status === 'graded' ? (
                                                        <div>
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                                <Award className="h-3 w-3" />
                                                                Nilai: {sub.grade}
                                                            </span>
                                                            {sub.feedback && (
                                                                <p className="mt-1 max-w-[180px] truncate text-[10px] text-slate-400" title={sub.feedback}>
                                                                    "{sub.feedback}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : sub.status === 'submitted' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                                            <Clock className="h-3 w-3" />
                                                            Menanti Review
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Terlambat
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Mentor Evaluator */}
                                                <td className="px-5 py-4">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {sub.submission?.mentor_name ?? 'Mentor Penilai'}
                                                    </span>
                                                </td>

                                                {/* Tanggal Serah */}
                                                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                                    {sub.created_at_formatted}
                                                </td>

                                                {/* Sertifikat */}
                                                <td className="px-5 py-4 text-right">
                                                    {sub.certificate_url ? (
                                                        <a
                                                            href={sub.certificate_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                            Sertifikat Terbit
                                                        </a>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">
                                                            Belum Terbit
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                                                Tidak ada pengajuan proyek yang cocok dengan filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {submissions.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Total {submissions.total} pengajuan proyek
                                </span>
                                <div className="flex items-center gap-1">
                                    {submissions.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                      ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                                      : 'text-slate-300 dark:text-slate-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

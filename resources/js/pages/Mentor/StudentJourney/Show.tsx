import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Flame,
    Star,
    Target,
    CalendarDays,
    Award,
    ShieldCheck,
    Layers3,
    BarChart3,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

interface CareerGroup {
    id: string;
    name: string;
}

interface CompletedModule {
    title: string;
    type: string;
}

interface QuizResult {
    id: string;
    title: string;
    score: number;
    passed: boolean;
    completedAt: string | null;
}

interface Character {
    name: string;
    avatar: string | null;
}

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    level: number;
    currentExp: number;
    totalExp: number;
    expMax: number;
    progressPercent: number;
    completedModules: number;
    totalModules: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    totalSubmissions: number;
    status: string;
    lastActivity: string | null;
    careerGroups: CareerGroup[];
    completedModulesList: CompletedModule[];
    quizResults: QuizResult[];
    character: Character | null;
}

interface Submission {
    id: string;
    title: string;
    careerPath?: string;
    grade: number;
    status: string;
    createdAt: string | null;
}

interface Props {
    student: Student;
    submissions: Submission[];
}

export default function StudentJourneyShow({ student, submissions }: Props) {
    const avatar =
        student.character?.avatar ||
        student.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Tidak ada tanggal';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail Siswa: ${student.name}`} />

            <div className="min-h-screen bg-slate-50/50 pt-6 pb-20 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/mentor/student-journey"
                        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft size={16} /> Kembali ke Daftar Siswa
                    </Link>

                    {/* TOP HERO CARD - Profil Utama & Ringkasan Gamifikasi */}
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                            {/* Character Unboxed */}
                            <div className="flex w-32 shrink-0 justify-center sm:w-40">
                                <img
                                    src={avatar}
                                    alt={student.name}
                                    className="h-40 w-auto object-contain drop-shadow-md sm:h-48"
                                />
                            </div>

                            <div className="w-full flex-1">
                                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="text-center sm:text-left">
                                        <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                                    student.status.toLowerCase() ===
                                                    'active'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-slate-100 text-slate-700 ring-1 ring-slate-500/10 ring-inset dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                <Clock size={12} /> Aktif:{' '}
                                                {student.lastActivity ? formatDate(student.lastActivity) : 'Tidak pernah'}
                                            </span>
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                            {student.name}
                                        </h1>
                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                            Kelas Karakter:{' '}
                                            {student.character?.name ||
                                                'Belum memilih kelas'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-end">
                                        <span className="text-xs font-medium text-slate-500">
                                            Total Modul Diselesaikan
                                        </span>
                                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                            {student.completedModules}/
                                            {student.totalModules}
                                        </span>
                                    </div>
                                </div>

                                {/* Analisis EXP & Level yang Terperinci */}
                                <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                Level Saat Ini
                                            </p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                Lvl {student.level}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex w-full items-center gap-3 md:border-l md:border-slate-200 md:pl-4 dark:border-slate-700">
                                        <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                                            <Flame size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                    Progress Level (Total:{' '}
                                                    {student.totalExp} XP)
                                                </p>
                                                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                                                    {student.currentExp} /{' '}
                                                    {student.expMax}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                <div
                                                    className="h-full rounded-full bg-orange-500 transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${(student.currentExp / student.expMax) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN DETAIL GRID */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* KOLOM KIRI: Statistik & Karir */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Metrik Performa Rinci */}
                            <div className="grid grid-cols-2 gap-4">
                                <MetricBox
                                    title="Rata-rata Nilai"
                                    value={student.averageScore}
                                    icon={
                                        <Star
                                            size={18}
                                            className="text-amber-500"
                                        />
                                    }
                                />
                                <MetricBox
                                    title="Nilai Tertinggi"
                                    value={student.highestScore}
                                    icon={
                                        <Award
                                            size={18}
                                            className="text-emerald-500"
                                        />
                                    }
                                />
                                <MetricBox
                                    title="Nilai Terendah"
                                    value={student.lowestScore}
                                    icon={
                                        <BarChart3
                                            size={18}
                                            className="text-rose-500"
                                        />
                                    }
                                />
                                <MetricBox
                                    title="Total Tugas"
                                    value={student.totalSubmissions}
                                    icon={
                                        <ShieldCheck
                                            size={18}
                                            className="text-indigo-500"
                                        />
                                    }
                                />
                            </div>

                            {/* Jalur Karir yang Diikuti */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                    <Layers3
                                        size={18}
                                        className="text-slate-400"
                                    />{' '}
                                    Jalur Karir Aktif
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {student.careerGroups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                            {group.name}
                                        </div>
                                    ))}
                                    {student.careerGroups.length === 0 && (
                                        <p className="text-sm text-slate-500">
                                            Belum mengikuti jalur karir apapun.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Progress Pembelajaran aktual dari DB */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Riwayat Modul yang Diselesaikan */}
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                Modul Diselesaikan
                                            </h3>
                                            <p className="text-xs font-medium text-slate-500">
                                                {student.completedModules} dari{' '}
                                                {student.totalModules} modul (
                                                {student.progressPercent}%)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${student.progressPercent}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {student.completedModulesList.map(
                                        (mod, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300"
                                            >
                                                <CheckCircle2
                                                    size={14}
                                                    className="text-emerald-500"
                                                />
                                                {mod.title}
                                            </div>
                                        ),
                                    )}
                                    {student.completedModulesList.length ===
                                        0 && (
                                        <p className="w-full rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-800/50">
                                            Belum ada modul yang diselesaikan.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Hasil Quiz (Progress Evaluasi) */}
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800/60">
                                    <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                        <Flame
                                            size={18}
                                            className="text-orange-500"
                                        />{' '}
                                        Hasil Evaluasi (Quiz)
                                    </h3>
                                    <span className="text-xs font-medium text-slate-500">
                                        Total: {student.quizResults.length} quiz
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {student.quizResults.map((quiz) => (
                                        <div
                                            key={quiz.id}
                                            className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/30"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-0.5 text-slate-400 dark:text-slate-500">
                                                    {quiz.passed ? (
                                                        <CheckCircle2
                                                            size={20}
                                                            className="text-emerald-500"
                                                        />
                                                    ) : (
                                                        <AlertCircle
                                                            size={20}
                                                            className="text-rose-500"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {quiz.title}
                                                    </h4>
                                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                                        <span
                                                            className={`rounded px-2 py-0.5 font-medium ${
                                                                quiz.passed
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                                            }`}
                                                        >
                                                            {quiz.passed
                                                                ? 'Lulus'
                                                                : 'Gagal'}
                                                        </span>
                                                        <span className="text-slate-400">
                                                            {formatDate(quiz.completedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start rounded-lg bg-slate-50 px-4 py-2 sm:items-end sm:bg-transparent sm:px-0 sm:py-0 dark:bg-slate-800/50 sm:dark:bg-transparent">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                    Nilai Quiz
                                                </span>
                                                <span className="text-xl font-black text-slate-900 dark:text-white">
                                                    {quiz.score}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {student.quizResults.length === 0 && (
                                        <div className="p-8 text-center text-sm text-slate-500">
                                            Belum ada quiz yang dikerjakan.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Riwayat Pengumpulan Tugas (Submissions) */}
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800/60">
                                    <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                        <BookOpen
                                            size={18}
                                            className="text-indigo-500"
                                        />{' '}
                                        Riwayat Pengumpulan Tugas
                                    </h3>
                                    <span className="text-xs font-medium text-slate-500">
                                        Total: {student.totalSubmissions} tugas
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {submissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/30"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-0.5 text-slate-400 dark:text-slate-500">
                                                    {[
                                                        'graded',
                                                        'passed',
                                                    ].includes(
                                                        sub.status.toLowerCase(),
                                                    ) ? (
                                                        <CheckCircle2
                                                            size={20}
                                                            className="text-emerald-500"
                                                        />
                                                    ) : (
                                                        <AlertCircle
                                                            size={20}
                                                            className="text-amber-500"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {sub.title}
                                                    </h4>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        Jalur:{' '}
                                                        {sub.careerPath ||
                                                            'Umum'}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                                        <span
                                                            className={`rounded px-2 py-0.5 font-medium ${
                                                                [
                                                                    'graded',
                                                                    'passed',
                                                                ].includes(
                                                                    sub.status.toLowerCase(),
                                                                )
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                            }`}
                                                        >
                                                            {sub.status ===
                                                            'graded'
                                                                ? 'Sudah Dinilai'
                                                                : sub.status}
                                                        </span>
                                                        <span className="text-slate-400">
                                                            {formatDate(sub.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start rounded-lg bg-slate-50 px-4 py-2 sm:items-end sm:bg-transparent sm:px-0 sm:py-0 dark:bg-slate-800/50 sm:dark:bg-transparent">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                    Nilai
                                                </span>
                                                <span className="text-xl font-black text-slate-900 dark:text-white">
                                                    {sub.grade}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {submissions.length === 0 && (
                                        <div className="p-8 text-center text-sm text-slate-500">
                                            Belum ada tugas yang dikumpulkan.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function MetricBox({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-start justify-between">
                <span className="text-xs font-medium text-slate-500">
                    {title}
                </span>
                {icon}
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
                {value}
            </span>
        </div>
    );
}

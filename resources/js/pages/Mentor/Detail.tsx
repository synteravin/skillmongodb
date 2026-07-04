import AppLayout from '@/layouts/app-layout';
import {
    Users,
    Award,
    TrendingUp,
    BookOpen,
    Activity,
    Zap,
    LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
type StatCardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
};

function StatCard({ title, value, icon: Icon }: StatCardProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 dark:border-slate-800 shadow-sm shadow-slate-100/50">
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400/60">
                        {title}
                    </h3>
                    <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-white">
                    {value}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// PROGRESS CHART COMPONENT
// ============================================================================
type ProgressChartProps = {
    progress: number;
    title: string;
    isScore?: boolean;
    score?: number;
};

function ProgressChart({
    progress,
    title,
    isScore = false,
    score,
}: ProgressChartProps) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-8 dark:border-slate-800 shadow-sm shadow-slate-100/50">
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10">
                <h3 className="mb-6 text-base font-semibold text-slate-800 dark:text-white">
                    {title}
                </h3>

                <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                        <svg
                            className="h-full w-full -rotate-90 transform"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-slate-200 dark:text-slate-800"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-semibold text-slate-800 dark:text-white">
                                {progress}%
                            </span>
                            {isScore && score !== undefined && (
                                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400/60">
                                    {score.toFixed(1)}/100
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// CAREER GROUP STATS COMPONENT
// ============================================================================
type CareerGroupType = {
    id: string;
    name: string;
    studentsEnrolled: number;
    averageProgress: number;
    averageScore: number;
    completionRate: number;
};

type CareerGroupStatsProps = {
    group: CareerGroupType;
    isSelected: boolean;
    onSelect: () => void;
};

function CareerGroupStats({
    group,
    isSelected,
    onSelect,
}: CareerGroupStatsProps) {
    return (
        <button
            onClick={onSelect}
            className={`relative overflow-hidden rounded-lg border p-6 text-left transition-all shadow-xs ${
                isSelected
                    ? 'border-indigo-350 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/5 shadow-indigo-100/30 dark:shadow-none'
                    : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 hover:shadow-sm'
            }`}
        >
            <div className="relative z-10">
                <h3 className="mb-4 flex items-center justify-between font-semibold text-slate-800 dark:text-white">
                    {group.name}
                    {isSelected && (
                        <span className="rounded-full border border-indigo-200 bg-white px-2 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-indigo-400">
                            Active
                        </span>
                    )}
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400/60">
                            Students
                        </span>
                        <span className="font-medium text-slate-800 dark:text-white">
                            {group.studentsEnrolled}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400/60">
                            Avg Progress
                        </span>
                        <span className="font-medium text-slate-800 dark:text-white">
                            {group.averageProgress}%
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400/60">
                            Avg Score
                        </span>
                        <span className="font-medium text-slate-800 dark:text-white">
                            {group.averageScore.toFixed(1)}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400/60">
                            Completion Rate
                        </span>
                        <span className="font-medium text-slate-800 dark:text-white">
                            {group.completionRate}%
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}

// ============================================================================
// STUDENT TABLE COMPONENT
// ============================================================================
type StudentType = {
    id: string;
    name: string;
    avatar: string | null;
    level: number;
    currentExp: number;
    progressPercent: number;
    averageScore: number;
    status: 'active' | 'in_progress' | 'completed';
    careerGroups: Array<{ id: string; name: string }>;
    character?: {
        name: string;
        avatar: string;
    };
};

type StudentTableProps = {
    students: StudentType[];
};

function StudentTable({ students }: StudentTableProps) {
    if (students.length === 0) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-8 text-center dark:border-slate-800 shadow-sm shadow-slate-100/50">
                <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                <p className="relative z-10 text-slate-500 dark:text-slate-400/60">
                    No students found
                </p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50">
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Level
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Progress
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800 dark:text-white">
                                Career Groups
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                className="border-b border-slate-200 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/30"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {student.avatar ? (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                                {student.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {student.name}
                                            </p>
                                            {student.character && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400/60">
                                                    {student.character.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-slate-800 dark:text-white">
                                        {student.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                            <div
                                                className="h-full bg-indigo-500"
                                                style={{
                                                    width: `${student.progressPercent}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-12 text-right text-sm font-medium text-slate-800 dark:text-white">
                                            {student.progressPercent}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-slate-800 dark:text-white">
                                        {student.averageScore.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium capitalize text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400/60">
                                        {student.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {student.careerGroups.map((group) => (
                                            <span
                                                key={group.id}
                                                className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400/60"
                                            >
                                                {group.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
type Mentor = {
    id: string;
    name: string;
    avatar: string | null;
    careerGroupsCount: number;
};

type Statistics = {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
    averageProgress: number;
    averageScore: number;
    averageLevel: number;
};

type CareerGroup = {
    id: string;
    name: string;
    studentsEnrolled: number;
    averageProgress: number;
    averageScore: number;
    completionRate: number;
};

type Student = {
    id: string;
    name: string;
    avatar: string | null;
    level: number;
    currentExp: number;
    progressPercent: number;
    averageScore: number;
    status: 'active' | 'in_progress' | 'completed';
    careerGroups: Array<{ id: string; name: string }>;
    character?: {
        name: string;
        avatar: string;
    };
};

type Props = {
    mentor: Mentor;
    statistics: Statistics;
    careerGroups: CareerGroup[];
    students: Student[];
};

export default function Detail({
    mentor,
    statistics,
    careerGroups,
    students,
}: Props) {
    const [selectedCareerGroup, setSelectedCareerGroup] = useState<
        string | null
    >(null);

    // Filter students by selected career group
    const filteredStudents = selectedCareerGroup
        ? students.filter((student) =>
              student.careerGroups.some(
                  (group) => group.id === selectedCareerGroup,
              ),
          )
        : students;

    return (
        <AppLayout>
            <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 sm:p-8 md:p-10 dark:border-slate-800 shadow-sm shadow-slate-100/50">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-2xl space-y-4">
                            <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                Mentor Details
                            </span>
                            <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                                {mentor.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                                {statistics.totalStudents} students •{' '}
                                {mentor.careerGroupsCount} career groups
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overall Statistics */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <StatCard
                        title="Total Students"
                        value={statistics.totalStudents}
                        icon={Users}
                    />
                    <StatCard
                        title="Active"
                        value={statistics.activeStudents}
                        icon={Activity}
                    />
                    <StatCard
                        title="Completed"
                        value={statistics.completedStudents}
                        icon={Award}
                    />
                    <StatCard
                        title="Avg Progress"
                        value={`${statistics.averageProgress}%`}
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Avg Score"
                        value={statistics.averageScore.toFixed(1)}
                        icon={Zap}
                    />
                    <StatCard
                        title="Avg Level"
                        value={statistics.averageLevel.toFixed(1)}
                        icon={BookOpen}
                    />
                </section>

                {/* Charts */}
                <section className="grid gap-6 md:grid-cols-2">
                    <ProgressChart
                        progress={statistics.averageProgress}
                        title="Average Progress"
                    />
                    <ProgressChart
                        progress={Math.round(
                            (statistics.averageScore / 100) * 100,
                        )}
                        title="Average Score"
                        isScore={true}
                        score={statistics.averageScore}
                    />
                </section>

                {/* Career Groups Overview */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                            Career Groups Overview
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {careerGroups.map((group) => (
                            <CareerGroupStats
                                key={group.id}
                                group={group}
                                isSelected={selectedCareerGroup === group.id}
                                onSelect={() =>
                                    setSelectedCareerGroup(
                                        selectedCareerGroup === group.id
                                            ? null
                                            : group.id,
                                    )
                                }
                            />
                        ))}
                    </div>
                </section>

                {/* Student Progress Details */}
                <section className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                            Student Progress Details
                        </h2>
                        {selectedCareerGroup && (
                            <button
                                onClick={() => setSelectedCareerGroup(null)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                    <StudentTable students={filteredStudents} />
                </section>
            </div>
        </AppLayout>
    );
}
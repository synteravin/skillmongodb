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
    color: 'indigo' | 'blue' | 'emerald' | 'purple' | 'orange' | 'pink';
};

const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    emerald:
        'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    purple: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
    orange: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20',
    pink: 'bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20',
};

const iconColorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    pink: 'text-pink-600 dark:text-pink-400',
};

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    return (
        <div
            className={`rounded-2xl border ${colorMap[color]} space-y-3 p-6 transition-all hover:shadow-lg dark:shadow-lg dark:shadow-black/20`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {title}
                </h3>
                <Icon className={`h-5 w-5 ${iconColorMap[color]}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
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
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-indigo-500/5 dark:border-slate-800/60 dark:bg-[#0a0d27] dark:shadow-indigo-500/10">
            <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
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
                            className="text-gray-200 dark:text-slate-700"
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
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {progress}%
                        </span>
                        {isScore && score !== undefined && (
                            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {score.toFixed(1)}/100
                            </span>
                        )}
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
            className={`rounded-2xl border p-6 text-left transition-all ${
                isSelected
                    ? 'border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-500/20 dark:border-indigo-500/50 dark:bg-indigo-500/10'
                    : 'border-gray-100 bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'
            }`}
        >
            <h3 className="mb-4 flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                {group.name}
                {isSelected && (
                    <span className="rounded-full bg-indigo-600 px-2 py-1 text-xs text-white">
                        Active
                    </span>
                )}
            </h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                        Students
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {group.studentsEnrolled}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                        Avg Progress
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {group.averageProgress}%
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                        Avg Score
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {group.averageScore.toFixed(1)}
                    </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">
                        Completion Rate
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {group.completionRate}%
                    </span>
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
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
            case 'in_progress':
                return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300';
            case 'completed':
                return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300';
            default:
                return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
        }
    };

    if (students.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-slate-800/60 dark:bg-[#0a0d27]">
                <p className="text-slate-500 dark:text-slate-400">
                    No students found
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-indigo-500/5 dark:border-slate-800/60 dark:bg-[#0a0d27] dark:shadow-indigo-500/10">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Level
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Progress
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                Career Groups
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => (
                            <tr
                                key={student.id}
                                className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/30"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {student.avatar ? (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-semibold text-white">
                                                {student.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {student.name}
                                            </p>
                                            {student.character && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {student.character.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {student.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                                style={{
                                                    width: `${student.progressPercent}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-12 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                            {student.progressPercent}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {student.averageScore.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(
                                            student.status,
                                        )}`}
                                    >
                                        {student.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {student.careerGroups.map((group) => (
                                            <span
                                                key={group.id}
                                                className="inline-block rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
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
            <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-indigo-500/5 sm:p-8 md:p-10 dark:border-slate-800/60 dark:bg-[#0a0d27] dark:shadow-indigo-500/10">
                    <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-10">
                        <Award className="h-64 w-64 rotate-12 transform text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/10"></div>
                    <div className="absolute right-20 bottom-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10"></div>

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <span>Mentor Details</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                    {mentor.name}
                                </span>
                            </h1>
                            <p className="text-lg text-slate-500 dark:text-slate-400">
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
                        color="indigo"
                    />
                    <StatCard
                        title="Active"
                        value={statistics.activeStudents}
                        icon={Activity}
                        color="blue"
                    />
                    <StatCard
                        title="Completed"
                        value={statistics.completedStudents}
                        icon={Award}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg Progress"
                        value={`${statistics.averageProgress}%`}
                        icon={TrendingUp}
                        color="purple"
                    />
                    <StatCard
                        title="Avg Score"
                        value={statistics.averageScore.toFixed(1)}
                        icon={Zap}
                        color="orange"
                    />
                    <StatCard
                        title="Avg Level"
                        value={statistics.averageLevel.toFixed(1)}
                        icon={BookOpen}
                        color="pink"
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
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Student Progress Details
                        </h2>
                        {selectedCareerGroup && (
                            <button
                                onClick={() => setSelectedCareerGroup(null)}
                                className="text-sm text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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

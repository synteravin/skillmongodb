import AppLayout from '@/layouts/app-layout';
import { router, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AvatarCropper from '@/components/AvatarCropper';
import {
    Pencil,
    Trash2,
    Plus,
    X,
    Users,
    Upload,
    User as UserIcon,
    Mail,
    Shield,
    Camera,
    Eye,
    Search,
    Loader2,
    Save,
    GraduationCap,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'mentor' | 'student';
    avatar?: string | null;
}

interface PaginatedUsers {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index({
    users,
    filters,
    stats,
}: {
    users: PaginatedUsers;
    filters?: { search?: string; role?: string };
    stats?: {
        total: number;
        students: number;
        mentors: number;
        admins: number;
    };
}) {
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedRole, setSelectedRole] = useState(filters?.role || 'all');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    const isAllSelected =
        users.data.length > 0 &&
        users.data.every((u) => selectedIds.includes(u._id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.data.map((u) => u._id));
        }
    };

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setConfirmModal({
            open: true,
            title: 'Hapus Massal User',
            message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} user terpilih? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus Terpilih',
            variant: 'danger',
            onConfirm: () => {
                router.post(
                    '/admin/users/bulk-delete',
                    { ids: selectedIds },
                    {
                        preserveScroll: true,
                        onSuccess: () => setSelectedIds([]),
                    },
                );
            },
        });
    };

    const handleBulkRoleChange = (role: 'admin' | 'mentor' | 'student') => {
        if (selectedIds.length === 0) return;
        setConfirmModal({
            open: true,
            title: 'Ubah Role Massal',
            message: `Ubah role ${selectedIds.length} user terpilih menjadi "${role}"?`,
            confirmText: 'Ubah Role',
            variant: 'info',
            onConfirm: () => {
                router.post(
                    '/admin/users/bulk-role',
                    { ids: selectedIds, role },
                    {
                        preserveScroll: true,
                        onSuccess: () => setSelectedIds([]),
                    },
                );
            },
        });
    };

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'student',
            avatar: null as File | null,
            _method: 'post',
        });

    useEffect(() => {
        const hasSearchChanged = searchQuery !== (filters?.search || '');
        const hasRoleChanged = selectedRole !== (filters?.role || 'all');

        if (!hasSearchChanged && !hasRoleChanged) {
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(() => {
            router.get(
                '/admin/users',
                {
                    search: searchQuery || undefined,
                    role: selectedRole !== 'all' ? selectedRole : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onFinish: () => setIsSearching(false),
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, selectedRole, filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        router.get(
            '/admin/users',
            {
                search: searchQuery || undefined,
                role: selectedRole !== 'all' ? selectedRole : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    /* ================= HANDLE FILE ================= */
    const handleFile = (file: File) => {
        setCropSrc(URL.createObjectURL(file));
    };

    const handleCropConfirm = (croppedFile: File) => {
        setData('avatar', croppedFile);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(croppedFile);
        setCropSrc(null);
    };

    const handleCropCancel = () => {
        setCropSrc(null);
    };

    const openCreate = () => {
        setEditUser(null);
        reset();
        clearErrors();
        setPreview(null);
        setData('_method', 'post');
        setShowModal(true);
    };

    const openEdit = (user: User) => {
        setEditUser(user);
        clearErrors();
        setPreview(user.avatar || null);
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            avatar: null,
            _method: 'put',
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editUser ? `/admin/users/${editUser._id}` : '/admin/users';
        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
                setPreview(null);
            },
        });
    };

    const deleteUser = (id: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus User',
            message:
                'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete User',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/users/${id}`, { preserveScroll: true });
            },
        });
    };

    // Helper for role badges
    const RoleBadge = ({ role }: { role: string }) => {
        const styles = {
            admin: 'bg-rose-500/10 text-rose-500 border-rose-200 dark:border-rose-500/20 dark:text-rose-400',
            mentor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-500/20 dark:text-indigo-400',
            student:
                'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 dark:text-emerald-400',
        };
        const dotStyles = {
            admin: 'bg-rose-500',
            mentor: 'bg-indigo-500',
            student: 'bg-emerald-500',
        };
        const activeStyle =
            styles[role as keyof typeof styles] ||
            'bg-slate-500/10 text-slate-500 border-slate-200 dark:border-slate-800 dark:text-slate-400';
        const dotStyle =
            dotStyles[role as keyof typeof dotStyles] || 'bg-slate-400';

        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${activeStyle}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
                {role
                    ? role.charAt(0).toUpperCase() + role.slice(1)
                    : 'Unknown'}
            </span>
        );
    };

    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/40';

    const labelClass =
        'mb-1.5 block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase';

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                    {/* Grid Pattern Motif */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                Administration
                            </span>
                            <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                User Management
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                Manage system users, assigned roles, and access
                                control.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {isSearching ? (
                                        <Loader2
                                            size={14}
                                            className="animate-spin text-indigo-600 dark:text-indigo-400"
                                        />
                                    ) : (
                                        <Search
                                            size={14}
                                            className="text-slate-400"
                                        />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-9 pl-9 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-indigo-300 sm:w-64 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/40"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title="Clear search"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </form>

                            {/* Add User Button */}
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#3B28F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2a1ce0]"
                            >
                                <Plus size={16} />
                                Add User
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <section className="grid gap-4 sm:grid-cols-3">
                    {/* Card 1: Total Users */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                    Total Users
                                </span>
                                <p className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-white">
                                    {stats?.total ?? users.total}
                                </p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    Registered platform accounts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Students */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                    Students
                                </span>
                                <p className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-white">
                                    {stats?.students ?? 0}
                                </p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    {stats?.total
                                        ? Math.round(
                                              ((stats.students ?? 0) /
                                                  stats.total) *
                                                  100,
                                          )
                                        : 0}
                                    % of total users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Mentors & Staff */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                    Mentors & Staff
                                </span>
                                <p className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-white">
                                    {(stats?.mentors ?? 0) +
                                        (stats?.admins ?? 0)}
                                </p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    {stats?.mentors ?? 0} Mentors,{' '}
                                    {stats?.admins ?? 0} Admins
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Users Table */}
                <section className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    {/* Table Header / Bulk Action Bar */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        {selectedIds.length > 0 ? (
                            <div className="-mx-6 -my-4 flex w-full flex-wrap items-center justify-between gap-3 border-b border-indigo-200 bg-indigo-50/70 px-6 py-3 dark:border-indigo-800/60 dark:bg-indigo-950/40">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                    />
                                    <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                                        {selectedIds.length} User Terpilih
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-white p-1 text-xs font-medium dark:border-indigo-800 dark:bg-slate-900">
                                        <span className="px-2 text-[0.7rem] font-semibold text-slate-500 uppercase">
                                            Ubah Role:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleBulkRoleChange('student')
                                            }
                                            className="rounded px-2 py-1 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            Student
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleBulkRoleChange('mentor')
                                            }
                                            className="rounded px-2 py-1 text-purple-600 transition-colors hover:bg-slate-100 dark:text-purple-400 dark:hover:bg-slate-800"
                                        >
                                            Mentor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleBulkRoleChange('admin')
                                            }
                                            className="rounded px-2 py-1 text-indigo-600 transition-colors hover:bg-slate-100 dark:text-indigo-400 dark:hover:bg-slate-800"
                                        >
                                            Admin
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
                                    >
                                        <Trash2 size={13} />
                                        Hapus Terpilih
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedIds([])}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title="Batal Pilih"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-100/70 p-1 dark:border-slate-800/60 dark:bg-slate-900/50">
                                {[
                                    {
                                        id: 'all',
                                        label: 'All Users',
                                        count: stats?.total ?? users.total,
                                    },
                                    {
                                        id: 'student',
                                        label: 'Students',
                                        count: stats?.students ?? 0,
                                    },
                                    {
                                        id: 'mentor',
                                        label: 'Mentors',
                                        count: stats?.mentors ?? 0,
                                    },
                                    {
                                        id: 'admin',
                                        label: 'Admins',
                                        count: stats?.admins ?? 0,
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setSelectedRole(tab.id)}
                                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                            selectedRole === tab.id
                                                ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                                                selectedRole === tab.id
                                                    ? 'bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'
                                                    : 'bg-slate-200/60 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Table */}
                    <div className="relative z-10 hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                                    <th className="w-10 px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-500">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-500">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-500">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-500">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-right text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length > 0 ? (
                                    users.data.map((user, i) => (
                                        <tr
                                            key={user._id}
                                            className={`border-b border-slate-200 transition-colors dark:border-slate-800 ${
                                                selectedIds.includes(user._id)
                                                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                                                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                                            }`}
                                        >
                                            <td className="w-10 px-4 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        user._id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelectOne(
                                                            user._id,
                                                        )
                                                    }
                                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-400 tabular-nums dark:text-slate-600">
                                                    {(users.from ?? 0) + i}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            user.avatar
                                                                ? user.avatar
                                                                : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                                        }
                                                        className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                                                        alt={user.name}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                                                            {user.name}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400/60">
                                                            @{user.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 dark:text-slate-400/60">
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/users/${user._id}`}
                                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteUser(user._id)
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                                    <Users
                                                        size={24}
                                                        className="text-slate-400"
                                                    />
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-white">
                                                    No users found
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400/60">
                                                    {searchQuery
                                                        ? `No results for "${searchQuery}"`
                                                        : 'Get started by adding a new user.'}
                                                </p>
                                                {!searchQuery && (
                                                    <button
                                                        onClick={openCreate}
                                                        className="mt-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
                                                    >
                                                        Add First User
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="relative z-10 divide-y divide-slate-200 lg:hidden dark:divide-slate-800">
                        {users.data.length > 0 ? (
                            users.data.map((user, i) => (
                                <div
                                    key={user._id}
                                    className={`flex items-center justify-between gap-3 px-5 py-3.5 transition-colors ${
                                        selectedIds.includes(user._id)
                                            ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(
                                                user._id,
                                            )}
                                            onChange={() =>
                                                toggleSelectOne(user._id)
                                            }
                                            className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                        />
                                        <span className="w-4 shrink-0 text-xs font-medium text-slate-400 tabular-nums dark:text-slate-600">
                                            {(users.from ?? 0) + i}
                                        </span>
                                        <img
                                            src={
                                                user.avatar
                                                    ? user.avatar
                                                    : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                            }
                                            className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                                            alt={user.name}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-slate-500 dark:text-slate-400/60">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                                title="View"
                                            >
                                                <Eye size={14} />
                                            </Link>
                                            <button
                                                onClick={() => openEdit(user)}
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteUser(user._id)
                                                }
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                    <Users
                                        size={24}
                                        className="text-slate-400"
                                    />
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">
                                    No users found
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400/60">
                                    {searchQuery
                                        ? `No results for "${searchQuery}"`
                                        : 'Get started by adding a new user.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="relative z-10 flex items-center justify-between border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                            <span className="text-xs text-slate-500 dark:text-slate-400/60">
                                Showing{' '}
                                <span className="font-semibold text-slate-800 dark:text-white">
                                    {users.from}
                                </span>{' '}
                                –{' '}
                                <span className="font-semibold text-slate-800 dark:text-white">
                                    {users.to}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-slate-800 dark:text-white">
                                    {users.total}
                                </span>
                            </span>

                            <div className="flex items-center gap-1">
                                {users.links.map((link, i) => {
                                    const labelLower = link.label.toLowerCase();
                                    const isPrev = labelLower.includes('previous') || labelLower.includes('&laquo;') || labelLower.includes('laquo');
                                    const isNext = labelLower.includes('next') || labelLower.includes('&raquo;') || labelLower.includes('raquo');
                                    
                                    const renderLabel = () => {
                                        if (isPrev) return <ChevronLeft size={14} className="shrink-0" />;
                                        if (isNext) return <ChevronRight size={14} className="shrink-0" />;
                                        return link.label;
                                    };

                                    return link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors ${
                                                link.active
                                                    ? 'border border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400'
                                                    : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {renderLabel()}
                                        </Link>
                                    ) : (
                                        <span
                                            key={i}
                                            className="cursor-not-allowed flex h-7 min-w-7 items-center justify-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-400 tabular-nums opacity-50 dark:border-slate-800 dark:text-slate-600"
                                        >
                                            {renderLabel()}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0"
                            onClick={() => !processing && setShowModal(false)}
                        />

                        <form
                            onSubmit={submit}
                            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {/* Top accent */}
                            <div className="pointer-events-none absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* Modal Header */}
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                                <div>
                                    <span className="mb-2 block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                        {editUser ? 'Edit User' : 'New User'}
                                    </span>
                                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                        {editUser
                                            ? 'Edit User Details'
                                            : 'Create New User'}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400/60">
                                        {editUser
                                            ? "Update the user's information and role."
                                            : 'Add a new user to the system.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        !processing && setShowModal(false)
                                    }
                                    disabled={processing}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-grow space-y-5 overflow-y-auto p-6">
                                {/* AVATAR */}
                                <div className="flex flex-col items-center justify-center">
                                    <div
                                        className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-200 transition-colors hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-500/40"
                                        onClick={() =>
                                            document
                                                .getElementById('avatarInput')
                                                ?.click()
                                        }
                                    >
                                        {preview ? (
                                            <>
                                                <img
                                                    src={preview}
                                                    alt="Avatar Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <Camera
                                                        size={20}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-slate-400 transition-colors group-hover:text-indigo-500">
                                                <Upload size={18} />
                                                <span className="text-[9px] font-semibold tracking-wider uppercase">
                                                    Photo
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            e.target.files &&
                                            handleFile(e.target.files[0])
                                        }
                                    />
                                    {errors.avatar && (
                                        <span className="mt-2 text-xs font-medium text-rose-500">
                                            {errors.avatar}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Full Name */}
                                        <div>
                                            <label className={labelClass}>
                                                Full Name{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <UserIcon
                                                        size={14}
                                                        className="text-slate-400"
                                                    />
                                                </div>
                                                <input
                                                    placeholder="John Doe"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-9`}
                                                    required
                                                />
                                            </div>
                                            {errors.name && (
                                                <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Username */}
                                        <div>
                                            <label className={labelClass}>
                                                Username{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-sm font-semibold text-slate-400">
                                                        @
                                                    </span>
                                                </div>
                                                <input
                                                    placeholder="johndoe"
                                                    value={data.username}
                                                    onChange={(e) =>
                                                        setData(
                                                            'username',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-8`}
                                                    required
                                                />
                                            </div>
                                            {errors.username && (
                                                <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                                    {errors.username}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={labelClass}>
                                            Email Address{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail
                                                    size={14}
                                                    className="text-slate-400"
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} pl-9`}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Password */}
                                        <div>
                                            <label className={labelClass}>
                                                Password{' '}
                                                {editUser ? (
                                                    <span className="font-normal text-slate-400 normal-case">
                                                        (optional)
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder={
                                                    editUser
                                                        ? 'Leave blank to keep'
                                                        : '••••••••'
                                                }
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                required={!editUser}
                                            />
                                            {errors.password && (
                                                <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                                    {errors.password}
                                                </span>
                                            )}
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <label className={labelClass}>
                                                Role{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Shield
                                                        size={14}
                                                        className="text-slate-400"
                                                    />
                                                </div>
                                                <select
                                                    value={data.role}
                                                    onChange={(e) =>
                                                        setData(
                                                            'role',
                                                            e.target
                                                                .value as any,
                                                        )
                                                    }
                                                    className={`${inputClass} appearance-none pl-9`}
                                                >
                                                    <option value="student">
                                                        Student
                                                    </option>
                                                    <option value="mentor">
                                                        Mentor
                                                    </option>
                                                    <option value="admin">
                                                        Admin
                                                    </option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                                    <svg
                                                        className="h-4 w-4 text-slate-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.role && (
                                                <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                                    {errors.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        !processing && setShowModal(false)
                                    }
                                    disabled={processing}
                                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-6 py-2.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                                >
                                    {processing ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {editUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <ConfirmModal
                    open={confirmModal.open}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    confirmText={confirmModal.confirmText}
                    variant={confirmModal.variant}
                    onConfirm={confirmModal.onConfirm}
                    onClose={() =>
                        setConfirmModal((prev) => ({ ...prev, open: false }))
                    }
                />

                {cropSrc && (
                    <AvatarCropper
                        imageSrc={cropSrc}
                        onConfirm={handleCropConfirm}
                        onCancel={handleCropCancel}
                    />
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { router, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
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
}: {
    users: PaginatedUsers;
    filters?: { search?: string };
}) {
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

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

    /* ================= HANDLE SEARCH ================= */
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/users',
                { search: searchQuery },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { search: searchQuery },
            { preserveState: true, preserveScroll: true },
        );
    };

    /* ================= HANDLE FILE ================= */
    const handleFile = (file: File) => {
        setData('avatar', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const openCreate = () => {
        setEditUser(null);
        setPreview(null);
        clearErrors();
        setData({
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'student',
            avatar: null,
            _method: 'post',
        });
        setShowModal(true);
    };

    const openEdit = (user: User) => {
        setEditUser(user);
        clearErrors();
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            avatar: null,
            _method: 'put',
        });
        setPreview(user.avatar ?? null);
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const url =
            editUser && editUser._id
                ? `/admin/users/${editUser._id}`
                : '/admin/users';

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteUser = (id: string) => {
        if (
            confirm(
                'Are you sure you want to delete this user? This action cannot be undone.',
            )
        ) {
            router.delete(`/admin/users/${id}`, { preserveScroll: true });
        }
    };

    // Helper for role badges
    const RoleBadge = ({ role }: { role: string }) => {
        const styles = {
            admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            mentor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
        const activeStyle =
            styles[role as keyof typeof styles] ||
            'bg-slate-500/10 text-slate-400 border-slate-500/20';

        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${activeStyle}`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${role === 'admin' ? 'bg-rose-400' : role === 'mentor' ? 'bg-blue-400' : role === 'student' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                ></span>
                {role
                    ? role.charAt(0).toUpperCase() + role.slice(1)
                    : 'Unknown'}
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="mx-auto min-h-screen max-w-[1200px] space-y-6 px-6 py-6 sm:space-y-8 sm:px-6 lg:px-10">
                {/* HEADER & CONTROLS */}
                <div className="relative flex flex-col items-stretch justify-between gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:gap-6 sm:p-6 lg:flex-row lg:items-center">
                    {/* Decorative gradient blur */}
                    <div className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>

                    <div className="z-10 flex w-full items-center justify-between lg:w-auto">
                        <div>
                            <h1 className="flex items-center gap-2.5 text-xl font-bold text-white sm:text-3xl">
                                <div className="shrink-0 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2">
                                    <Users className="h-5 w-5 text-indigo-400 sm:h-6 sm:w-6" />
                                </div>
                                <span>User Management</span>
                            </h1>
                            <p className="mt-1 ml-1 hidden text-xs text-slate-400 sm:mt-2 sm:block sm:text-sm">
                                Manage system users, assigned roles, and access
                                control.
                            </p>
                        </div>

                        {/* Mobile Add User Button (compact beside the title for superb mobile real estate) */}
                        <button
                            onClick={openCreate}
                            className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-purple-500 active:scale-95 lg:hidden"
                            title="Add User"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="z-10 flex w-full flex-col items-stretch gap-3.5 sm:flex-row sm:items-center lg:w-auto">
                        {/* Search Form */}
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-grow sm:min-w-[300px]"
                        >
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <Search size={16} className="text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, username or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pr-4 pl-10 text-base text-white transition-all placeholder:text-slate-600 hover:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none md:text-sm"
                            />
                        </form>

                        {/* Desktop Add User Button */}
                        <button
                            onClick={openCreate}
                            className="group hidden items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 lg:flex"
                        >
                            <Plus
                                size={18}
                                className="transition-transform duration-300 group-hover:rotate-90"
                            />
                            Add User
                        </button>
                    </div>
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-xl lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-slate-800/80 bg-slate-950/50 text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="group transition-colors hover:bg-slate-800/40"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                user.avatar
                                                                    ? user.avatar
                                                                    : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                                            }
                                                            className="h-10 w-10 rounded-full border border-slate-700/50 bg-slate-800 object-cover shadow-sm"
                                                            alt={user.name}
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 rounded-full shadow-inner ring-1 ring-white/10"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white transition-colors group-hover:text-indigo-400">
                                                            {user.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            @{user.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Link
                                                        href={`/admin/users/${user._id}`}
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                                        title="View User Details"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
                                                        title="Edit User"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteUser(user._id)
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/50">
                                                    <Users
                                                        size={32}
                                                        className="text-slate-500"
                                                    />
                                                </div>
                                                <h3 className="mb-1 text-lg font-medium text-white">
                                                    No users found
                                                </h3>
                                                <p className="max-w-sm text-sm text-slate-400">
                                                    {searchQuery
                                                        ? `No users matching "${searchQuery}" were found.`
                                                        : 'Get started by adding a new user to the system.'}
                                                </p>
                                                {!searchQuery && (
                                                    <button
                                                        onClick={openCreate}
                                                        className="mt-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
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
                </div>

                {/* CARD VIEW (Responsive Grid of Cards on Mobile & Tablet) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                    {users.data.length > 0 ? (
                        users.data.map((user) => {
                            // Assign premium roles specific color gradients on left edge indicators
                            const roleColor =
                                user.role === 'admin'
                                    ? 'from-rose-500 to-pink-600'
                                    : user.role === 'mentor'
                                      ? 'from-blue-500 to-indigo-600'
                                      : 'from-emerald-500 to-teal-600';

                            return (
                                <div
                                    key={user._id}
                                    className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 py-4.5 pr-4 pl-5 shadow-lg transition-all duration-300 hover:border-slate-700/80 active:scale-[0.99]"
                                >
                                    {/* Accent strip signifying user role */}
                                    <div
                                        className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${roleColor} rounded-l-2xl`}
                                    ></div>

                                    {/* Avatar & User Details */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={
                                                        user.avatar
                                                            ? user.avatar
                                                            : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                                    }
                                                    className="bg-slate-850 h-11 w-11 rounded-full border border-slate-700/40 object-cover shadow-sm"
                                                    alt={user.name}
                                                />
                                                <div className="pointer-events-none absolute inset-0 rounded-full shadow-inner ring-1 ring-white/10"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="truncate text-sm font-semibold text-white transition-colors hover:text-indigo-400">
                                                    {user.name}
                                                </h4>
                                                <p className="truncate text-xs text-slate-500">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <RoleBadge role={user.role} />
                                        </div>
                                    </div>

                                    {/* Email Contact Row */}
                                    <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3.5 py-2.5 text-xs font-medium text-slate-400">
                                        <Mail
                                            size={14}
                                            className="shrink-0 text-indigo-400/80"
                                        />
                                        <span className="truncate select-all">
                                            {user.email}
                                        </span>
                                    </div>

                                    {/* Touch-Friendly Action Buttons */}
                                    <div className="mt-4 grid grid-cols-3 gap-2 pt-1">
                                        <Link
                                            href={`/admin/users/${user._id}`}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-300 shadow-sm transition-all active:scale-95"
                                        >
                                            <Eye
                                                size={14}
                                                className="text-slate-400"
                                            />
                                            <span>View</span>
                                        </Link>
                                        <button
                                            onClick={() => openEdit(user)}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2.5 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 active:scale-95"
                                        >
                                            <Pencil size={14} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900 px-4 py-16 text-center">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/50">
                                <Users size={28} className="text-slate-500" />
                            </div>
                            <h3 className="mb-1 text-base font-medium text-white">
                                No users found
                            </h3>
                            <p className="max-w-sm text-xs text-slate-400">
                                {searchQuery
                                    ? `No users matching "${searchQuery}" were found.`
                                    : 'Get started by adding a new user to the system.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={openCreate}
                                    className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-400 transition-colors hover:bg-indigo-500/20"
                                >
                                    Add First User
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* DESKTOP PAGINATION */}
                {users.last_page > 1 && (
                    <div className="hidden items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900 px-6 py-4 shadow-xl lg:flex">
                        <div className="text-sm text-slate-400">
                            Showing{' '}
                            <span className="font-medium text-white">
                                {users.from}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium text-white">
                                {users.to}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-white">
                                {users.total}
                            </span>{' '}
                            results
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {users.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                                            link.active
                                                ? 'border border-indigo-400 bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                : 'border border-slate-800/80 bg-slate-950/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="cursor-not-allowed rounded-xl border border-slate-800/50 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-600 opacity-50"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                )}

                {/* MOBILE PAGINATION (Clean, touch-friendly, non-cluttering pagination for small devices) */}
                {users.last_page > 1 && (
                    <div className="block rounded-2xl border border-slate-800/80 bg-slate-900 p-4 shadow-xl lg:hidden">
                        <div className="flex items-center justify-between gap-3">
                            {/* Previous Button */}
                            {users.links[0]?.url ? (
                                <Link
                                    href={users.links[0].url}
                                    preserveScroll
                                    className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-900 active:scale-95"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-xl border border-slate-800/50 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-600 opacity-40">
                                    Previous
                                </span>
                            )}

                            {/* Page Indicator */}
                            <div className="text-xs font-medium text-slate-400">
                                Page{' '}
                                <span className="font-semibold text-white">
                                    {users.current_page}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-white">
                                    {users.last_page}
                                </span>
                            </div>

                            {/* Next Button */}
                            {users.links[users.links.length - 1]?.url ? (
                                <Link
                                    href={
                                        users.links[users.links.length - 1].url
                                    }
                                    preserveScroll
                                    className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-900 active:scale-95"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-xl border border-slate-800/50 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-600 opacity-40">
                                    Next
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm duration-200 fade-in">
                        {/* Overlay click area */}
                        <div
                            className="absolute inset-0"
                            onClick={() => !processing && setShowModal(false)}
                        ></div>

                        <form
                            onSubmit={submit}
                            className="relative z-10 flex max-h-[90vh] w-full max-w-md animate-in flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1120] shadow-2xl duration-200 zoom-in-95"
                        >
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/50 p-5">
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {editUser
                                            ? 'Edit User Details'
                                            : 'Create New User'}
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
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
                                    className="rounded-lg border border-slate-800/50 bg-slate-950/50 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                    disabled={processing}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="custom-scrollbar flex-grow space-y-5 overflow-y-auto p-5">
                                {/* AVATAR */}
                                <div className="flex flex-col items-center justify-center">
                                    <div
                                        className={`relative h-20 w-20 rounded-full border-2 border-dashed bg-slate-950/80 ${errors.avatar ? 'border-rose-500' : 'border-slate-700 hover:border-indigo-500'} group flex cursor-pointer items-center justify-center overflow-hidden shadow-inner transition-all duration-300`}
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
                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <Camera
                                                        size={20}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-500 transition-colors group-hover:text-indigo-400">
                                                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                                    <Upload size={14} />
                                                </div>
                                                <span className="text-[9px] font-medium tracking-wider uppercase">
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
                                        <div>
                                            <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-400">
                                                Full Name{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                    <UserIcon
                                                        size={16}
                                                        className={
                                                            errors.name
                                                                ? 'text-rose-500'
                                                                : 'text-slate-500'
                                                        }
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
                                                    className={`w-full border bg-slate-950 py-2.5 pr-4 pl-10 ${errors.name ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-base text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none md:text-sm`}
                                                    required
                                                />
                                            </div>
                                            {errors.name && (
                                                <span className="mt-1 ml-1 inline-block text-xs text-rose-500">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-400">
                                                Username{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                    <span
                                                        className={`text-sm font-semibold ${errors.username ? 'text-rose-500' : 'text-slate-500'}`}
                                                    >
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
                                                    className={`w-full border bg-slate-950 py-2.5 pr-4 pl-9 ${errors.username ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-base text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none md:text-sm`}
                                                    required
                                                />
                                            </div>
                                            {errors.username && (
                                                <span className="mt-1 ml-1 inline-block text-xs text-rose-500">
                                                    {errors.username}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-400">
                                            Email Address{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <Mail
                                                    size={16}
                                                    className={
                                                        errors.email
                                                            ? 'text-rose-500'
                                                            : 'text-slate-500'
                                                    }
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
                                                className={`w-full border bg-slate-950 py-2.5 pr-4 pl-10 ${errors.email ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-base text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none md:text-sm`}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <span className="mt-1 ml-1 inline-block text-xs text-rose-500">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-400">
                                                Password{' '}
                                                {editUser ? (
                                                    <span className="ml-1 text-[10px] text-slate-500">
                                                        (Optional)
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
                                                className={`w-full border bg-slate-950 px-4 py-2.5 ${errors.password ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-base text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none md:text-sm`}
                                                required={!editUser}
                                            />
                                            {errors.password && (
                                                <span className="mt-1 ml-1 inline-block text-xs text-rose-500">
                                                    {errors.password}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-400">
                                                Role{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                    <Shield
                                                        size={16}
                                                        className={
                                                            errors.role
                                                                ? 'text-rose-500'
                                                                : 'text-slate-500'
                                                        }
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
                                                    className={`w-full border bg-slate-950 py-2.5 pr-8 pl-10 ${errors.role ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} appearance-none rounded-xl text-base text-white transition-all focus:ring-1 focus:outline-none md:text-sm`}
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
                                                        xmlns="http://www.w3.org/2000/svg"
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
                                                <span className="mt-1 ml-1 inline-block text-xs text-rose-500">
                                                    {errors.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-800/80 bg-slate-900/40 p-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        !processing && setShowModal(false)
                                    }
                                    disabled={processing}
                                    className="rounded-xl px-4.5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing && (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}
                                    {editUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #475569;
                }
            `}</style>
        </AppLayout>
    );
}

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
            mentor: 'bg-[#7C5CFF]/15 text-[#7C5CFF] border-[#7C5CFF]/20',
            student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
        const activeStyle =
            styles[role as keyof typeof styles] ||
            'bg-slate-500/10 text-slate-400 border-slate-500/20';

        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold tracking-wide ${activeStyle}`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${role === 'admin' ? 'bg-rose-400' : role === 'mentor' ? 'bg-[#7C5CFF]' : role === 'student' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                ></span>
                {role
                    ? role.charAt(0).toUpperCase() + role.slice(1)
                    : 'Unknown'}
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="relative min-h-screen bg-[#030712] text-white px-6 py-4 sm:px-6 lg:px-10 overflow-hidden">
                {/* Subtle top-center ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-4 sm:space-y-5">
                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#0d0f17] dark:bg-[#0d0f17] bg-[#f5f6ff]"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />

                        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-3">
                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                                dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                                border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)]"
                                >
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#3B28F6]">
                                        Users
                                    </span>
                                </div>

                                {/* Title */}
                                <h1
                                    className="m-0 text-3xl font-bold leading-none tracking-tight"
                                    style={{
                                        background: 'linear-gradient(135deg, #2a1ce0 0%, #3B28F6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        fontFamily:'Orbitron, sans-serif',
                                    }}
                                >
                                    User Management
                                </h1>

                                {/* Subtitle */}
                                <p className="m-0 text-[13.5px] dark:text-slate-400/70 text-slate-600/75">
                                    Manage system users, assigned roles, and access control.
                                    <span className="mx-2 inline-block h-[11px] w-px dark:bg-white/10 bg-black/10 align-middle" />
                                    <span className="text-xs dark:text-slate-400/30 text-slate-500/35 tracking-wide">
                                        Access and roles control
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* Search Form */}
                                <form
                                    onSubmit={handleSearch}
                                    className="relative flex-grow sm:min-w-[280px]"
                                >
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search size={14} className="text-slate-450" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by name, username or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-white/8 bg-white/4 py-2 pr-4 pl-8 text-sm text-white transition-all placeholder:text-slate-500 hover:bg-white/5 focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] focus:outline-none"
                                    />
                                </form>

                                {/* Desktop Add User Button */}
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#3B28F6] hover:bg-[#2A1CE0] text-white text-sm font-medium border border-[#4A38FF] shadow-sm shadow-[#3B28F6]/20 transition-colors duration-200"
                            >
                                <Plus size={16} />
                                Add User
                            </button>
                            </div>
                        </div>
                    </header>


            {/* TABLE VIEW (Desktop) */}
            <div className="relative hidden overflow-hidden rounded-xl border border-indigo-100 dark:border-[#7C5CFF]/15 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] shadow-md lg:block">

                <div className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(108, 99, 255, 0.4), transparent)' }} />

                {/* Header */}
                <div className="border-b px-5 py-3.5 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-white"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Users
                    </h2>
                </div>

                {/* List */}
                <div className="divide-y divide-indigo-50 dark:divide-white/5">
                    {users.data.length > 0 ? (
                        users.data.map((user, i) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between gap-4 py-2.5 px-5 transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.04)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Left: Number + Avatar + Name */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <span className="text-sm font-black tabular-nums shrink-0" style={{ color: 'rgba(108,99,255,0.35)' }}>
                                        {i + 1}
                                    </span>
                                    <div className="relative shrink-0">
                                        <img
                                            src={
                                                user.avatar
                                                    ? user.avatar
                                                    : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                            }
                                            className="h-8 w-8 rounded-full border border-indigo-100 dark:border-white/10 bg-slate-100 dark:bg-slate-800 object-cover"
                                            alt={user.name}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                            {user.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Email + Role + Actions */}
                                <div className="flex items-center gap-5 shrink-0">
                                    <span className="text-xs font-medium hidden xl:block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        {user.email}
                                    </span>
                                    <RoleBadge role={user.role} />
                                    <div className="flex items-center gap-0.5">
                                        <Link
                                            href={`/admin/users/${user._id}`}
                                            className="rounded-lg p-1.5 text-slate-450 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
                                            title="View User Details"
                                        >
                                            <Eye size={14} />
                                        </Link>
                                        <button
                                            onClick={() => openEdit(user)}
                                            className="rounded-lg p-1.5 text-slate-450 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-[#7C5CFF]/15 hover:text-indigo-650 dark:hover:text-[#7C5CFF] transition-all duration-200"
                                            title="Edit User"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="rounded-lg p-1.5 text-slate-450 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200"
                                            title="Delete User"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-50 dark:border-white/8 bg-slate-50 dark:bg-white/5">
                                <Users size={32} className="text-slate-400" />
                            </div>
                            <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-white">
                                No users found
                            </h3>
                            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                {searchQuery
                                    ? `No users matching "${searchQuery}" were found.`
                                    : 'Get started by adding a new user to the system.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={openCreate}
                                    className="mt-6 rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-medium text-[#7C5CFF] transition-colors hover:bg-[#7C5CFF]/20"
                                >
                                    Add First User
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CARD VIEW (Mobile & Tablet) */}
            <div className="lg:hidden">
                {/* Header */}
                <div className="border-b px-5 py-3.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Users
                    </h2>
                </div>

                {/* List */}
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {users.data.length > 0 ? (
                        users.data.map((user, i) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between gap-3 py-3 px-5 transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.04)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Left: Number + Avatar + Name */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-sm font-black tabular-nums shrink-0 w-7" style={{ color: 'rgba(108,99,255,0.35)' }}>
                                        #{i + 1}
                                    </span>
                                    <img
                                        src={
                                            user.avatar
                                                ? user.avatar
                                                : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 object-cover bg-slate-800 shrink-0"
                                        alt={user.name}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-400/70">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Role + Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <RoleBadge role={user.role} />
                                    <div className="flex items-center gap-0.5">
                                        <Link
                                            href={`/admin/users/${user._id}`}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                                            title="View"
                                        >
                                            <Eye size={14} />
                                        </Link>
                                        <button
                                            onClick={() => openEdit(user)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#7C5CFF]/15 hover:text-[#7C5CFF] transition-all duration-200"
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200"
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
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/5">
                                <Users size={28} className="text-slate-400" />
                            </div>
                            <h3 className="mb-1 text-base font-medium text-white">No users found</h3>
                            <p className="max-w-sm text-xs text-slate-400">
                                {searchQuery
                                    ? `No users matching "${searchQuery}" were found.`
                                    : 'Get started by adding a new user to the system.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={openCreate}
                                    className="mt-5 rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-4 py-2 text-xs font-semibold text-[#7C5CFF] transition-colors hover:bg-[#7C5CFF]/20"
                                >
                                    Add First User
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

               {/* DESKTOP PAGINATION */}
            {users.last_page > 1 && (
                <div className="hidden items-center justify-between gap-4 border-t px-5 py-3.5 lg:flex"
                    style={{ borderColor: 'rgba(255,255,255,0.05)', fontFamily: "'Outfit', sans-serif" }}>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Showing{' '}
                        <span className="font-semibold text-white">{users.from}</span>
                        {' '}–{' '}
                        <span className="font-semibold text-white">{users.to}</span>
                        {' '}of{' '}
                        <span className="font-semibold text-white">{users.total}</span>
                    </span>

                    <div className="flex items-center gap-1">
                        {users.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    preserveScroll
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold tabular-nums transition-all duration-150 ${
                                        link.active
                                            ? 'bg-[#7C5CFF] text-white'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                    style={!link.active ? undefined : undefined}
                                    onMouseEnter={e => { if (!link.active) e.currentTarget.style.background = 'rgba(108,99,255,0.08)' }}
                                    onMouseLeave={e => { if (!link.active) e.currentTarget.style.background = 'transparent' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold tabular-nums text-slate-600 cursor-not-allowed opacity-40"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        )}
                    </div>
                </div>
            )}

            {/* MOBILE PAGINATION */}
            {users.last_page > 1 && (
                <div className="flex items-center justify-between border-t px-5 py-3.5 lg:hidden"
                    style={{ borderColor: 'rgba(255,255,255,0.05)', fontFamily: "'Outfit', sans-serif" }}>

                    {users.links[0]?.url ? (
                        <Link
                            href={users.links[0].url}
                            preserveScroll
                            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition-all active:scale-95"
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            ← Prev
                        </Link>
                    ) : (
                        <span className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 opacity-40 cursor-not-allowed">
                            ← Prev
                        </span>
                    )}

                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Page{' '}
                        <span className="font-bold text-white">{users.current_page}</span>
                        {' '}/{' '}
                        <span className="font-bold text-white">{users.last_page}</span>
                    </span>

                    {users.links[users.links.length - 1]?.url ? (
                        <Link
                            href={users.links[users.links.length - 1].url}
                            preserveScroll
                            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition-all active:scale-95"
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            Next →
                        </Link>
                    ) : (
                        <span className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 opacity-40 cursor-not-allowed">
                            Next →
                        </span>
                    )}
                </div>
            )}

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-[#030712]/80 p-4 backdrop-blur-sm duration-200 fade-in">
    {/* Overlay click area */}
    <div
        className="absolute inset-0"
        onClick={() => !processing && setShowModal(false)}
    ></div>

    <form
        onSubmit={submit}
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-xl border bg-gradient-to-b from-[#0e0e1a] to-[#090910] shadow-2xl duration-200 zoom-in-95"
        style={{
            borderColor: 'rgba(108,99,255,0.3)',
            fontFamily: "'Outfit', sans-serif",
        }}
    >
        {/* Top highlight line */}
        <div
            className="pointer-events-none absolute top-0 left-10 right-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent)' }}
        />

        {/* Modal Header */}
        <div
            className="flex shrink-0 items-center justify-between p-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
        >
            <div>
                <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1"
                    style={{ borderColor: 'rgba(59,40,246,0.35)', background: 'rgba(59,40,246,0.1)' }}>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#3B28F6]">
                        {editUser ? 'Edit User' : 'New User'}
                    </span>
                </div>
                <h2
                    className="text-lg font-bold uppercase tracking-[0.12em] text-white"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {editUser ? 'Edit User Details' : 'Create New User'}
                </h2>
                <p className="mt-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif" }}>
                    {editUser
                        ? "Update the user's information and role."
                        : 'Add a new user to the system.'}
                </p>
            </div>
            <button
                type="button"
                onClick={() => !processing && setShowModal(false)}
                className="rounded-lg p-2 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                disabled={processing}
            >
                <X size={16} />
            </button>
        </div>

        <div className="custom-scrollbar flex-grow space-y-5 overflow-y-auto p-6">
            {/* AVATAR */}
            <div className="flex flex-col items-center justify-center">
                <div
                    className={`relative h-24 w-24 rounded-full border-2 border-dashed group flex cursor-pointer items-center justify-center overflow-hidden shadow-inner transition-all duration-300`}
                    style={{
                        borderColor: errors.avatar ? '#f43f5e' : 'rgba(108,99,255,0.35)',
                        background: 'rgba(255,255,255,0.03)',
                    }}
                    onClick={() =>
                        document.getElementById('avatarInput')?.click()
                    }
                    onMouseEnter={e => { if (!errors.avatar) (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.7)'); }}
                    onMouseLeave={e => { if (!errors.avatar) (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)'); }}
                >
                    {preview ? (
                        <>
                            <img
                                src={preview}
                                alt="Avatar Preview"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Camera size={22} className="text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center transition-colors" style={{ color: 'rgba(108,99,255,0.6)' }}>
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                                style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}>
                                <Upload size={15} />
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
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                />
                {errors.avatar && (
                    <span className="mt-2 text-xs font-medium text-rose-400">
                        {errors.avatar}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                        <label className="mb-1.5 ml-1 block text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                            Full Name <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <UserIcon size={15} style={{ color: errors.name ? '#f43f5e' : 'rgba(255,255,255,0.3)' }} />
                            </div>
                            <input
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-600 focus:outline-none focus:ring-1 rounded-lg"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${errors.name ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                                onFocus={e => { if (!errors.name) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.6)'; }}
                                onBlur={e => { if (!errors.name) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                required
                            />
                        </div>
                        {errors.name && (
                            <span className="mt-1 ml-1 inline-block text-xs text-rose-400">{errors.name}</span>
                        )}
                    </div>
                    {/* Username */}
                    <div>
                        <label className="mb-1.5 ml-1 block text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                            Username <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <span className="text-sm font-semibold" style={{ color: errors.username ? '#f43f5e' : 'rgba(255,255,255,0.3)' }}>@</span>
                            </div>
                            <input
                                placeholder="johndoe"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full py-2.5 pr-4 pl-9 text-sm text-white transition-all placeholder:text-slate-600 focus:outline-none rounded-lg"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${errors.username ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                                onFocus={e => { if (!errors.username) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.6)'; }}
                                onBlur={e => { if (!errors.username) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                required
                            />
                        </div>
                        {errors.username && (
                            <span className="mt-1 ml-1 inline-block text-xs text-rose-400">{errors.username}</span>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1.5 ml-1 block text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                        Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <Mail size={15} style={{ color: errors.email ? '#f43f5e' : 'rgba(255,255,255,0.3)' }} />
                        </div>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-600 focus:outline-none rounded-lg"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${errors.email ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                fontFamily: "'Outfit', sans-serif",
                            }}
                            onFocus={e => { if (!errors.email) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.6)'; }}
                            onBlur={e => { if (!errors.email) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="mt-1 ml-1 inline-block text-xs text-rose-400">{errors.email}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Password */}
                    <div>
                        <label className="mb-1.5 ml-1 block text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                            Password{' '}
                            {editUser ? (
                                <span className="ml-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                            ) : (
                                <span className="text-rose-400">*
                                </span>
                            )}
                        </label>
                        <input
                            type="password"
                            placeholder={editUser ? 'Leave blank to keep' : '••••••••'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-4 py-2.5 text-sm text-white transition-all placeholder:text-slate-600 focus:outline-none rounded-lg"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${errors.password ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                fontFamily: "'Outfit', sans-serif",
                            }}
                            onFocus={e => { if (!errors.password) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.6)'; }}
                            onBlur={e => { if (!errors.password) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            required={!editUser}
                        />
                        {errors.password && (
                            <span className="mt-1 ml-1 inline-block text-xs text-rose-400">{errors.password}</span>
                        )}
                    </div>
                    {/* Role */}
                    <div>
                        <label className="mb-1.5 ml-1 block text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                            Role <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <Shield size={15} style={{ color: errors.role ? '#f43f5e' : 'rgba(255,255,255,0.3)' }} />
                            </div>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as any)}
                                className="w-full appearance-none py-2.5 pr-8 pl-10 text-sm text-white transition-all focus:outline-none rounded-lg"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${errors.role ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                                onFocus={e => { if (!errors.role) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.6)'; }}
                                onBlur={e => { if (!errors.role) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            >
                                <option value="student" style={{ background: '#0e0e1a' }}>Student</option>
                                <option value="mentor" style={{ background: '#0e0e1a' }}>Mentor</option>
                                <option value="admin" style={{ background: '#0e0e1a' }}>Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.role && (
                            <span className="mt-1 ml-1 inline-block text-xs text-rose-400">{errors.role}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex shrink-0 justify-end gap-3 p-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', fontFamily: "'Outfit', sans-serif" }}
        >
            <button
                type="button"
                onClick={() => !processing && setShowModal(false)}
                disabled={processing}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                    background: 'linear-gradient(135deg, #3B28F6 0%, #6C63FF 100%)',
                    border: '1px solid rgba(108,99,255,0.4)',
                    boxShadow: '0 4px 15px rgba(59,40,246,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,40,246,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,40,246,0.3)'; }}
            >
                {processing && <Loader2 size={16} className="animate-spin" />}
                {editUser ? 'Save Changes' : 'Create User'}
            </button>
        </div>
    </form>
</div>
                )}
            </div>
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

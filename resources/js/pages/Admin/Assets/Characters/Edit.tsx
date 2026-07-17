import { useForm, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, X } from 'lucide-react';

/* ================= TYPES ================= */
type Character = {
    id: string;
    name: string;
    tagline?: string;
    backstory: string;
    quote?: string;
    avatar: string;
    character_type?: string[];
    abilities?: string[];
    personality?: string[];
    cosmetic_bonus?: string[];
    guide_power?: {
        title?: string;
        description?: string;
    };
    system_bonus?: {
        exp_boost?: string;
        gold_boost?: string;
    };
    avatar_url?: string;
};

/* ================= TAG INPUT ================= */
function TagInput({
    value,
    onChange,
    placeholder,
}: {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder: string;
}) {
    const [input, setInput] = useState('');

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!value.includes(input.trim())) {
                onChange([...value, input.trim()]);
            }
            setInput('');
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:focus-within:border-slate-500 dark:focus-within:ring-slate-500">
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-white/10 dark:text-slate-300"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            removeTag(tag);
                        }}
                        className="rounded-full p-0.5 hover:bg-slate-300 dark:hover:bg-white/20"
                    >
                        <X size={14} />
                    </button>
                </span>
            ))}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={value.length === 0 ? placeholder : 'Add more...'}
                className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder-slate-600"
            />
        </div>
    );
}

/* ================= PAGE ================= */
export default function Edit({ character }: { character: Character }) {
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        _method: 'put',
        name: character.name || '',
        tagline: character.tagline || '',
        backstory: character.backstory || '',
        quote: character.quote || '',
        guide_power_title: character.guide_power?.title || '',
        guide_power_description: character.guide_power?.description || '',
        character_type: Array.isArray(character.character_type)
            ? character.character_type
            : [],
        abilities: Array.isArray(character.abilities)
            ? character.abilities
            : [],
        personality: Array.isArray(character.personality)
            ? character.personality
            : [],
        cosmetic_bonus: Array.isArray(character.cosmetic_bonus)
            ? character.cosmetic_bonus
            : [],
        system_bonus: {
            exp_boost: character.system_bonus?.exp_boost || '',
            gold_boost: character.system_bonus?.gold_boost || '',
        },
        avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        setData('avatar', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/assets/characters/${character.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] px-4 py-8 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link
                                href="/admin/assets"
                                className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Assets
                            </Link>
                            <h1
                                className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                Edit Character
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Update {character.name}'s information and
                                traits.
                            </p>
                        </div>

                        {/* Character ID badge */}
                        <div className="inline-flex items-center self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400">
                            ID:{' '}
                            <span className="ml-1.5 font-mono text-slate-700 dark:text-slate-300">
                                {character.id}
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {/* LEFT COLUMN */}
                        <div className="space-y-5">
                            {/* Basic Info Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-5 py-3.5 dark:border-white/5">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Basic Information
                                    </h2>
                                </div>
                                <div className="space-y-4 p-4 sm:p-5">
                                    <div>
                                        <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Character Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="e.g. Orion The Sage"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Tagline
                                            </label>
                                            <input
                                                type="text"
                                                value={data.tagline}
                                                onChange={(e) =>
                                                    setData(
                                                        'tagline',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Master of the Arcane"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Quote
                                            </label>
                                            <input
                                                type="text"
                                                value={data.quote}
                                                onChange={(e) =>
                                                    setData(
                                                        'quote',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Magic is merely science..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Guide Power Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.guide_power_title}
                                                onChange={(e) =>
                                                    setData(
                                                        'guide_power_title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Arcane Insight"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Guide Power Description
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    data.guide_power_description
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'guide_power_description',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Reveals hidden clues..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Backstory
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={data.backstory}
                                            onChange={(e) =>
                                                setData(
                                                    'backstory',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Write the character's origins and lore..."
                                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-5">
                            {/* Avatar Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-5 py-3 dark:border-white/5">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Avatar
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileRef.current?.click()}
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                                            dragActive
                                                ? 'border-slate-400 bg-slate-50 dark:border-slate-500 dark:bg-white/5'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                                            <div className="absolute inset-0 z-10 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                            <img
                                                src={
                                                    preview ??
                                                    character.avatar_url ??
                                                    character.avatar
                                                }
                                                alt="Avatar"
                                                className="h-full max-w-full rounded-lg object-contain"
                                            />
                                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white">
                                                    Change Image
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                Replace or drag image here
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                                Leave empty to keep current
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0])
                                                handleFile(e.target.files[0]);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Traits & Abilities Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-5 py-3.5 dark:border-white/5">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Traits &amp; Abilities
                                    </h2>
                                </div>
                                <div className="space-y-4 p-4 sm:p-5">
                                    <div>
                                        <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Character Types
                                        </label>
                                        <TagInput
                                            value={data.character_type}
                                            onChange={(tags) =>
                                                setData('character_type', tags)
                                            }
                                            placeholder="Add types (e.g. Mage, Support)"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Abilities
                                        </label>
                                        <TagInput
                                            value={data.abilities}
                                            onChange={(tags) =>
                                                setData('abilities', tags)
                                            }
                                            placeholder="Add abilities"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Personality Traits
                                        </label>
                                        <TagInput
                                            value={data.personality}
                                            onChange={(tags) =>
                                                setData('personality', tags)
                                            }
                                            placeholder="Add traits (e.g. Wise, Calm)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bonuses Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-5 py-3.5 dark:border-white/5">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Bonuses
                                    </h2>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                EXP Boost (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    data.system_bonus.exp_boost
                                                }
                                                onChange={(e) =>
                                                    setData('system_bonus', {
                                                        ...data.system_bonus,
                                                        exp_boost:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="e.g. 15"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Gold Boost (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    data.system_bonus.gold_boost
                                                }
                                                onChange={(e) =>
                                                    setData('system_bonus', {
                                                        ...data.system_bonus,
                                                        gold_boost:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="e.g. 10"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Cosmetic Bonuses
                                            </label>
                                            <TagInput
                                                value={data.cosmetic_bonus}
                                                onChange={(tags) =>
                                                    setData(
                                                        'cosmetic_bonus',
                                                        tags,
                                                    )
                                                }
                                                placeholder="Add cosmetic bonuses"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                                <Link
                                    href="/admin/assets"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Character'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

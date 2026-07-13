import { useForm, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, X } from 'lucide-react';

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
                        onClick={() => removeTag(tag)}
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

export default function CreateCharacter() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        tagline: '',
        backstory: '',
        quote: '',
        guide_power_title: '',
        guide_power_description: '',
        character_type: [] as string[],
        abilities: [] as string[],
        personality: [] as string[],
        system_bonus: {
            exp_boost: '',
            gold_boost: '',
        },
        cosmetic_bonus: [] as string[],
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/assets/characters', { forceFormData: true });
    };

    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] px-4 py-8 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="w-full space-y-6">
                    {/* Header */}
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
                            Create Character
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Add a new character, define their traits, abilities,
                            and bonuses.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-3"
                    >
                        {/* LEFT COLUMN */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* Basic Info Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Basic Information
                                    </h2>
                                </div>
                                <div className="space-y-5 p-4 sm:p-6">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Character Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="e.g. Orion The Sage"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                placeholder="e.g. Magic is merely science we don't understand yet."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                placeholder="e.g. Reveals hidden clues in challenges."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Traits & Abilities Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Traits &amp; Abilities
                                    </h2>
                                </div>
                                <div className="space-y-5 p-4 sm:p-6">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Character Types
                                        </label>
                                        <TagInput
                                            value={data.character_type}
                                            onChange={(tags) =>
                                                setData('character_type', tags)
                                            }
                                            placeholder="Press enter to add types (e.g. Mage, Support)"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Abilities
                                        </label>
                                        <TagInput
                                            value={data.abilities}
                                            onChange={(tags) =>
                                                setData('abilities', tags)
                                            }
                                            placeholder="Press enter to add abilities"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Personality Traits
                                        </label>
                                        <TagInput
                                            value={data.personality}
                                            onChange={(tags) =>
                                                setData('personality', tags)
                                            }
                                            placeholder="Press enter to add traits (e.g. Wise, Calm)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bonuses Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Bonuses
                                    </h2>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
                                                placeholder="Press enter to add cosmetic bonuses"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-5">
                            {/* Avatar Card */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                                <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                        Avatar
                                    </h2>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition-all sm:p-8 ${
                                            dragActive
                                                ? 'border-slate-400 bg-slate-50 dark:border-slate-500 dark:bg-white/5'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0])
                                                    handleFile(
                                                        e.target.files[0],
                                                    );
                                            }}
                                        />

                                        {preview ? (
                                            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                                                <div className="absolute inset-0 z-10 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="h-full max-w-full rounded-lg object-contain"
                                                />
                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                    <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white">
                                                        Change
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="rounded-full border border-slate-200 bg-slate-100 p-3 text-slate-400 dark:border-slate-700 dark:bg-white/5 dark:text-slate-500">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="22"
                                                        height="22"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                                    PNG, JPG, WEBP up to 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.avatar && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {errors.avatar}
                                        </p>
                                    )}
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
                                        ? 'Saving...'
                                        : 'Save Character'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

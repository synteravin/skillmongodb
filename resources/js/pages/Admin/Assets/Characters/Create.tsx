import { useForm, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ImagePlus, X, ChevronLeft, Save } from 'lucide-react';

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
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50">
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                    >
                        <X size={14} />
                    </button>
                </span>
            ))}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={value.length === 0 ? placeholder : "Add more..."}
                className="flex-1 min-w-[120px] bg-transparent px-2 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
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
        post('/admin/assets/characters', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 py-8 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link 
                                href="/admin/assets/characters" 
                                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            >
                                <ChevronLeft size={16} />
                                Back to Characters
                            </Link>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Create Character
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Add a new character, define their traits, abilities, and bonuses.
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Saving...' : 'Save Character'}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-3">
                        {/* LEFT COLUMN */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Basic Info */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="mb-6 flex items-center text-lg font-bold text-slate-900 dark:text-white">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                        1
                                    </span>
                                    Basic Information
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Character Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Orion The Sage"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tagline</label>
                                            <input
                                                type="text"
                                                value={data.tagline}
                                                onChange={(e) => setData('tagline', e.target.value)}
                                                placeholder="e.g. Master of the Arcane"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Quote</label>
                                            <input
                                                type="text"
                                                value={data.quote}
                                                onChange={(e) => setData('quote', e.target.value)}
                                                placeholder="e.g. Magic is merely science we don't understand yet."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guide Power Title</label>
                                            <input
                                                type="text"
                                                value={data.guide_power_title}
                                                onChange={(e) => setData('guide_power_title', e.target.value)}
                                                placeholder="e.g. Arcane Insight"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guide Power Description</label>
                                            <input
                                                type="text"
                                                value={data.guide_power_description}
                                                onChange={(e) => setData('guide_power_description', e.target.value)}
                                                placeholder="e.g. Reveals hidden clues in challenges."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Backstory</label>
                                        <textarea
                                            rows={4}
                                            value={data.backstory}
                                            onChange={(e) => setData('backstory', e.target.value)}
                                            placeholder="Write the character's origins and lore..."
                                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Traits */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="mb-6 flex items-center text-lg font-bold text-slate-900 dark:text-white">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        2
                                    </span>
                                    Traits & Abilities
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Character Types</label>
                                        <TagInput
                                            value={data.character_type}
                                            onChange={(tags) => setData('character_type', tags)}
                                            placeholder="Press enter to add types (e.g. Mage, Support)"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Abilities</label>
                                        <TagInput
                                            value={data.abilities}
                                            onChange={(tags) => setData('abilities', tags)}
                                            placeholder="Press enter to add abilities"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Personality Traits</label>
                                        <TagInput
                                            value={data.personality}
                                            onChange={(tags) => setData('personality', tags)}
                                            placeholder="Press enter to add traits (e.g. Wise, Calm)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bonuses */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="mb-6 flex items-center text-lg font-bold text-slate-900 dark:text-white">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                        3
                                    </span>
                                    Bonuses
                                </h2>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">EXP Boost (%)</label>
                                        <input
                                            type="number"
                                            value={data.system_bonus.exp_boost}
                                            onChange={(e) => setData('system_bonus', { ...data.system_bonus, exp_boost: e.target.value })}
                                            placeholder="e.g. 15"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Gold Boost (%)</label>
                                        <input
                                            type="number"
                                            value={data.system_bonus.gold_boost}
                                            onChange={(e) => setData('system_bonus', { ...data.system_bonus, gold_boost: e.target.value })}
                                            placeholder="e.g. 10"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Cosmetic Bonuses</label>
                                        <TagInput
                                            value={data.cosmetic_bonus}
                                            onChange={(tags) => setData('cosmetic_bonus', tags)}
                                            placeholder="Press enter to add cosmetic bonuses"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="mb-6 flex items-center text-lg font-bold text-slate-900 dark:text-white">
                                    Avatar
                                </h2>
                                
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                                        dragActive
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                                            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    {preview ? (
                                        <>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 z-10" />
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="h-48 w-48 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-slate-800"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 z-20">
                                                <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                                                    Change Image
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="rounded-full bg-slate-100 p-4 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400">
                                                <ImagePlus size={32} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    Click to upload or drag & drop
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    SVG, PNG, JPG or GIF (max. 2MB)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleFile(e.target.files[0]);
                                        }
                                    }}
                                />

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 sm:hidden">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {processing ? 'Saving...' : 'Save Character'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

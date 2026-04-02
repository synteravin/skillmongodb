import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

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
        <div className="flex flex-wrap gap-2 rounded-lg border p-3 dark:border-gray-700">
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-sm text-white"
                >
                    {tag}

                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-xs opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                </span>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm outline-none"
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

        post('/admin/characters', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl p-6">
                {/* HEADER */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create Character
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400">
                        Create a new mentor character for SkillVentura
                    </p>
                </div>

                <form onSubmit={submit} className="grid gap-8 lg:grid-cols-3">
                    {/* LEFT SIDE */}

                    <div className="space-y-6 lg:col-span-2">
                        {/* BASIC INFO */}

                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            <h2 className="mb-4 text-lg font-semibold">
                                Basic Information
                            </h2>

                            <div className="grid gap-4">
                                <input
                                    placeholder="Character Name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />

                                <input
                                    placeholder="Tagline"
                                    value={data.tagline}
                                    onChange={(e) =>
                                        setData('tagline', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />

                                <input
                                    placeholder="Quote"
                                    value={data.quote}
                                    onChange={(e) =>
                                        setData('quote', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />

                                <input
                                    placeholder="Guide Power Title"
                                    value={data.guide_power_title}
                                    onChange={(e) =>
                                        setData('guide_power_title', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />

                                <input
                                    placeholder="Guide Power Description"
                                    value={data.guide_power_description}
                                    onChange={(e) =>
                                        setData('guide_power_description', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />

                                <textarea
                                    rows={5}
                                    placeholder="Backstory"
                                    value={data.backstory}
                                    onChange={(e) =>
                                        setData('backstory', e.target.value)
                                    }
                                    className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />
                            </div>
                        </div>

                        {/* CHARACTER TRAITS */}

                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            <h2 className="mb-4 text-lg font-semibold">
                                Character Traits
                            </h2>

                            <div className="grid gap-4">
                                <TagInput
                                    value={data.character_type}
                                    onChange={(tags) =>
                                        setData('character_type', tags)
                                    }
                                    placeholder="Add character type"
                                />

                                <TagInput
                                    value={data.abilities}
                                    onChange={(tags) =>
                                        setData('abilities', tags)
                                    }
                                    placeholder="Add ability (press enter)"
                                />

                                <TagInput
                                    value={data.personality}
                                    onChange={(tags) =>
                                        setData('personality', tags)
                                    }
                                    placeholder="Add personality (press enter)"
                                />
                            </div>
                        </div>

                        {/* STARTER BONUS */}

                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            <h2 className="mb-4 text-lg font-semibold">
                                Starter Bonus
                            </h2>

                            <div className="grid gap-4">
                                <div>
                                    <label className="text-sm font-medium">
                                        EXP Boost (%)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="15"
                                        className="mt-1 w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                        onChange={(e) =>
                                            setData('system_bonus', {
                                                ...data.system_bonus,
                                                exp_boost: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Gold Boost (%)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="30"
                                        className="mt-1 w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                                        onChange={(e) =>
                                            setData('system_bonus', {
                                                ...data.system_bonus,
                                                gold_boost: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <TagInput
                                    value={data.cosmetic_bonus}
                                    onChange={(tags) =>
                                        setData('cosmetic_bonus', tags)
                                    }
                                    placeholder="Add cosmetic bonus"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            <h2 className="mb-4 text-lg font-semibold">
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
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${dragActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-gray-800'
                                    : 'border-gray-300'
                                    }`}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="h-40 w-40 rounded-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-500">
                                            Drag & Drop image
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            or click to upload
                                        </p>
                                    </>
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
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Character'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

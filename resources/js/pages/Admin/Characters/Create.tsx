import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

export default function CreateCharacter() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        backstory: string;
        avatar: File | null;
    }>({
        name: '',
        backstory: '',
        avatar: null,
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
            <div className="mx-auto max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">
                    Create Character
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* NAME */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border px-4 py-2 focus:ring focus:outline-none"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* BACKSTORY */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Backstory
                        </label>
                        <textarea
                            rows={5}
                            className="w-full rounded-lg border px-4 py-2 focus:ring focus:outline-none"
                            value={data.backstory}
                            onChange={(e) =>
                                setData('backstory', e.target.value)
                            }
                        />
                        {errors.backstory && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.backstory}
                            </p>
                        )}
                    </div>

                    {/* AVATAR */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Avatar
                        </label>

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300'
                            }`}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-40 w-40 rounded-full object-cover"
                                />
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600">
                                        Drag & drop image here
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

                        {errors.avatar && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.avatar}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Create Character'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

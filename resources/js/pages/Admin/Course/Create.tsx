import { useForm } from "@inertiajs/react"
import { useState } from "react"
import AppLayout from "@/layouts/app-layout"

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        thumbnail: null as File | null
    })

    const [preview, setPreview] = useState<string | null>(null)

    function handleFile(file: File) {

        setData("thumbnail", file)

        const url = URL.createObjectURL(file)

        setPreview(url)

    }

    function handleDrop(e: React.DragEvent) {

        e.preventDefault()

        const file = e.dataTransfer.files[0]

        if (!file) return

        handleFile(file)

    }

    function submit(e: React.FormEvent) {

        e.preventDefault()

        if (!confirm("Create this course?")) return

        post("/admin/courses")

    }

    return (

        <AppLayout>

            <div className="max-w-2xl p-8 space-y-6">

                <h1 className="text-2xl font-bold">
                    Create Course
                </h1>

                <form onSubmit={submit} className="space-y-6">

                    {/* TITLE */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Course Title
                        </label>

                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data.title}
                            onChange={(e) =>
                                setData("title", e.target.value)
                            }
                        />

                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
                            </p>
                        )}

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>

                        <textarea
                            className="w-full border rounded p-2"
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />

                    </div>


                    {/* THUMBNAIL */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Thumbnail
                        </label>

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition"
                        >

                            {preview ? (

                                <img
                                    src={preview}
                                    className="mx-auto max-h-40 rounded"
                                />

                            ) : (

                                <p className="text-sm text-gray-500">
                                    Drag & Drop image here
                                    <br />
                                    or click to upload
                                </p>

                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {

                                    const file = e.target.files?.[0]

                                    if (file) handleFile(file)

                                }}
                            />

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        disabled={processing}
                        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                    >
                        {processing ? "Creating..." : "Create Course"}
                    </button>

                </form>

            </div>

        </AppLayout>

    )

}
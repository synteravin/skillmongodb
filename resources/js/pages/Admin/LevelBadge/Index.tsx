import { usePage, useForm } from "@inertiajs/react";

export default function LevelBadgePage() {
    const { badges } = usePage().props as any;

    type FormData = {
        name: string;
        order: string;
        icon: File | null;
    };

    const { data, setData, post } = useForm<FormData>({
        name: "",
        order: "",
        icon: null,
    });

    return (
<div className="p-6">

    {/* Title */}
    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Level Badges
    </h1>

    {/* FORM (horizontal) */}
    <form
        onSubmit={(e) => {
            e.preventDefault();
            post("/admin/levelbadge", {
                forceFormData: true,
            });
        }}
        className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-slate-700 
        bg-gray-50 dark:bg-slate-800/50 flex items-center gap-4 flex-wrap"
    >

        <input
            type="text"
            placeholder="Name"
            onChange={(e) => setData("name", e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border 
            border-gray-200 dark:border-slate-700 
            bg-white dark:bg-slate-900 
            text-gray-800 dark:text-white"
        />

        <input
            type="number"
            placeholder="Order"
            onChange={(e) => setData("order", e.target.value)}
            className="w-28 px-3 py-2 rounded-lg border 
            border-gray-200 dark:border-slate-700 
            bg-white dark:bg-slate-900 
            text-gray-800 dark:text-white"
        />

        <label className="flex items-center gap-3 px-4 py-2 rounded-lg 
            border border-gray-200 dark:border-slate-700
            bg-white dark:bg-slate-900
            text-gray-700 dark:text-slate-300
            cursor-pointer w-fit">

            <span className="px-3 py-1 rounded-md 
                bg-indigo-600 dark:bg-indigo-500 
                text-white text-sm">
                Choose File
            </span>

            <span className="text-sm">
                {data.icon ? data.icon.name : "No file selected"}
            </span>

            <input
                type="file"
                onChange={(e) =>
                    setData("icon", e.target.files?.[0] || null)
                }
                className="hidden"
            />
        </label>

        <button
            type="submit"
            className="px-5 py-2 rounded-lg 
            bg-indigo-600 dark:bg-indigo-500 
            text-white 
            border border-indigo-600 dark:border-indigo-500"
        >
            Create
        </button>

    </form>

    {/* TABLE */}
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-4 px-4 py-3 
            bg-gray-100 dark:bg-slate-800 
            text-sm font-semibold 
            text-gray-700 dark:text-slate-300">
            
            <div>Icon</div>
            <div>Name</div>
            <div>Order</div>
            <div className="text-right">Action</div>
        </div>

        {/* Rows */}
        {badges.map((badge: any, index: number) => (
            <div
                key={badge._id ?? index}
                className="grid grid-cols-4 items-center px-4 py-3 
                border-t border-gray-200 dark:border-slate-700 
                bg-white dark:bg-slate-900 
                text-gray-700 dark:text-slate-300"
            >

                <div>
                    <img
                        src={`/storage/${badge.icon}`}
                        className="w-10 h-10 rounded-md object-cover"
                    />
                </div>

                <div className="font-medium">
                    {badge.name}
                </div>

                <div>
                    {badge.order}
                </div>

               <div className="text-right">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full 
                        bg-green-100 text-green-700 
                        dark:bg-green-500/20 dark:text-green-400">
                        Done
                    </span>
                </div>

            </div>
        ))}

    </div>

</div>
    )
}
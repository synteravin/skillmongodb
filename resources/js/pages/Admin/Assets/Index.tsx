import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";

export default function AssetsPage({ stats }: any) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-[#050816] text-white p-6">

                <h1 className="text-2xl font-bold text-blue-400 mb-2">
                    Assets Management
                </h1>

                <p className="text-gray-400 mb-6">
                    Manage all game assets including ranks, characters, and badges.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* RANK */}
                    <Link
                        href="/admin/assets/ranks"
                        className="group p-6 border border-blue-800 bg-[#070c20] hover:scale-105 hover:border-blue-500 transition rounded-xl"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-lg group-hover:text-blue-400">
                                Level Rank
                            </h2>
                            <span className="text-xs text-blue-400">
                                {stats?.ranks ?? 0}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400">
                            Manage progression tiers and ranking system
                        </p>
                    </Link>

                    {/* CHARACTER */}
                    <Link
                        href="/admin/assets/characters"
                        className="group p-6 border border-blue-800 bg-[#070c20] hover:scale-105 hover:border-blue-500 transition rounded-xl"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-lg group-hover:text-blue-400">
                                Character
                            </h2>
                            <span className="text-xs text-blue-400">
                                {stats?.characters ?? 0}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400">
                            Manage avatars and playable identities
                        </p>
                    </Link>

                    {/* BADGE */}
                    <Link
                        href="/admin/assets/badges"
                        className="group p-6 border border-blue-800 bg-[#070c20] hover:scale-105 hover:border-blue-500 transition rounded-xl"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-lg group-hover:text-blue-400">
                                Level Badge
                            </h2>
                            <span className="text-xs text-blue-400">
                                {stats?.badges ?? 0}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400">
                            Manage achievements and milestones
                        </p>
                    </Link>

                </div>

            </div>
        </AppLayout>
    );
}
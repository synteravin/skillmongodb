export default function VisionMission() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-16 text-center text-4xl font-bold">
                    Vision & Mission
                </h2>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="rounded-xl bg-[#161A4E] p-8 text-white">
                        <h3 className="mb-4 text-2xl font-bold">Vision</h3>
                        <p className="text-gray-300">
                            Becoming the leading gamified learning ecosystem
                            that helps people build real-world tech skills.
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#161A4E] p-8 text-white">
                        <h3 className="mb-4 text-2xl font-bold">Mission</h3>
                        <p className="text-gray-300">
                            Empower learners through interactive challenges,
                            projects, and structured learning roadmaps.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

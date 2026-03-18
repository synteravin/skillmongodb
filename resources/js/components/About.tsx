export default function About() {
    return (
        <section id="about" className="py-24">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <h2 className="mb-16 text-center text-4xl font-bold">
                    About Skill Ventura
                </h2>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="rounded-xl bg-[#1D215D] p-8 text-white">
                        Skill Ventura adalah platform belajar berbasis
                        gamification.
                    </div>

                    <div className="rounded-xl bg-[#1D215D] p-8 text-white">
                        Kami membuat proses belajar terasa seperti bermain game.
                    </div>
                </div>
            </div>
        </section>
    );
}

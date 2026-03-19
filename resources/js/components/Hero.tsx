import { Link } from '@inertiajs/react';
import { login } from '@/routes';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section id="home" className="pt-32 pb-24">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-12 lg:flex-row">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-3xl leading-tight font-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                            Learn The Skills Play The Game Level Up Your Life
                        </h1>

                        <Link
                            href={login()}
                            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-8 py-4 font-bold"
                        >
                            Start Learning <ArrowRight />
                        </Link>
                    </div>

                    <div className="hidden flex-1 justify-center sm:flex">
                        <img
                            src="/images/play.png"
                            className="w-[260px] md:w-[420px] lg:w-[480px] xl:w-[540px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

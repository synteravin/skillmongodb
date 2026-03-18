export default function Contact() {
    return (
        <section id="contact" className="py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-16 text-center text-4xl font-bold">
                    Contact Us
                </h2>

                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div>
                        <h3 className="mb-4 text-2xl font-bold">
                            Get in Touch
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300">
                            Our support team is available Monday to Friday from
                            8 AM to 4 PM to help with any questions regarding
                            the platform.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <img src="/images/servis.webp" className="max-w-sm" />
                    </div>
                </div>
            </div>
        </section>
    );
}

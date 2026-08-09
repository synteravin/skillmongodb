import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { regenerateRecoveryCodes } from '@/routes/two-factor';
import AlertError from './alert-error';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
                    <LockKeyhole
                        className="size-4.5 text-indigo-500"
                        aria-hidden="true"
                    />
                    Kode Pemulihan Darurat (2FA)
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400/60">
                    Kode pemulihan digunakan untuk mengakses akun jika Anda
                    kehilangan perangkat autentikasi dua faktor. Simpan di
                    tempat yang aman.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={toggleCodesVisibility}
                        className="dark:text-slate-350 w-fit cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent
                            className="mr-2 size-4"
                            aria-hidden="true"
                        />
                        {codesAreVisible ? 'Sembunyikan' : 'Tampilkan'} Kode
                        Pemulihan
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={fetchRecoveryCodes}
                        >
                            {({ processing }) => (
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    disabled={processing}
                                    className="dark:text-slate-350 cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    aria-describedby="regenerate-warning"
                                >
                                    <RefreshCw className="mr-2 size-4" />
                                    {processing
                                        ? 'Memproses...'
                                        : 'Buat Ulang Kode'}
                                </Button>
                            )}
                        </Form>
                    )}
                </div>
                <div
                    id="recovery-codes-section"
                    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="mt-4 space-y-3">
                        {errors?.length ? (
                            <AlertError errors={errors} />
                        ) : (
                            <>
                                <div
                                    ref={codesSectionRef}
                                    className="dark:text-neutral-350 grid grid-cols-2 gap-2 rounded-xl border border-slate-200/50 bg-slate-50/80 p-4 font-mono text-xs font-extrabold text-slate-800 dark:border-slate-800/60 dark:bg-zinc-950/60"
                                    role="list"
                                    aria-label="Recovery codes"
                                >
                                    {recoveryCodesList.length ? (
                                        recoveryCodesList.map((code, index) => (
                                            <div
                                                key={index}
                                                role="listitem"
                                                className="border-slate-150 rounded-lg border bg-white px-2 py-1 text-center shadow-xs select-text dark:border-slate-800/80 dark:bg-slate-900"
                                            >
                                                {code}
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="col-span-2 space-y-2"
                                            aria-label="Loading recovery codes"
                                        >
                                            {Array.from(
                                                { length: 8 },
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-7 animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/30"
                                                        aria-hidden="true"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="text-[11px] text-slate-500 select-none dark:text-slate-400/60">
                                    <p
                                        id="regenerate-warning"
                                        className="leading-relaxed"
                                    >
                                        Setiap kode pemulihan hanya dapat
                                        digunakan sekali. Jika Anda kehilangan
                                        perangkat autentikasi, gunakan kode ini
                                        untuk masuk. Jika Anda memerlukan kode
                                        baru, klik tombol{' '}
                                        <span className="font-semibold text-slate-800 dark:text-white">
                                            Buat Ulang Kode
                                        </span>{' '}
                                        di atas.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

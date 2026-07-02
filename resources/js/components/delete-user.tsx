import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="relative overflow-hidden rounded-xl border border-red-200/50 bg-white/50 p-6 shadow-sm dark:border-red-950/30 dark:bg-gradient-to-b dark:from-[#0e0e1a]/40 dark:to-[#090910]/20">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-red-200/40 to-transparent dark:via-red-950/40" />

            <div className="mb-6 flex items-center gap-4 border-b border-red-50/50 pb-5 dark:border-red-950/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500 bg-red-500/10 text-red-500 shadow-xs dark:bg-red-500/20">
                    <Trash2 className="h-5.5 w-5.5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                        Delete Account
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400/60">
                        Permanently delete your account and all associated resources.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400/70">
                    Once your account is deleted, all of its resources and data will be permanently lost. This action is irreversible.
                </p>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                            className="cursor-pointer font-semibold shadow-xs"
                        >
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete your account?
                        </DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm you would like to
                            permanently delete your account.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Delete account
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

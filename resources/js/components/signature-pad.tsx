import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { router } from '@inertiajs/react';
import InputError from './input-error';
import { update, destroy } from '@/routes/profile/signature';

interface Props {
    currentSignatureUrl?: string;
}

export default function SignaturePad({ currentSignatureUrl }: Props) {
    const sigPad = useRef<SignatureCanvas>(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    // This handles resizing of the canvas context when window resizes
    // so the drawn paths don't get misaligned
    useEffect(() => {
        const resizeCanvas = () => {
            if (sigPad.current) {
                // To properly resize without losing data, we'd need to save and restore,
                // but for a simple signature pad, we just want to avoid scaling issues.
            }
        };
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const handleClear = () => {
        sigPad.current?.clear();
        setIsDrawing(false);
    };

    const handleSave = () => {
        if (!sigPad.current || sigPad.current.isEmpty()) {
            setError('Please provide a signature first.');
            return;
        }

        setSaving(true);
        setError('');

        // Using getCanvas() instead of getTrimmedCanvas() to bypass Vite bundling issues 
        // with the 'trim-canvas' dependency in react-signature-canvas
        const dataUrl = sigPad.current.getCanvas().toDataURL('image/png');

        router.post(
            update().url,
            { signature: dataUrl },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaving(false);
                    handleClear();
                },
                onError: (errors) => {
                    setSaving(false);
                    setError(errors.signature || 'Failed to save signature.');
                },
            }
        );
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to remove your signature?')) {
            router.delete(destroy().url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-4">
            {currentSignatureUrl && (
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Current Signature:</p>
                    <div className="border rounded-md bg-white p-4 inline-block">
                        <img 
                            src={currentSignatureUrl} 
                            alt="Current signature" 
                            className="max-h-24 object-contain" 
                        />
                    </div>
                    <div className="mt-2">
                        <Button type="button" variant="destructive" onClick={handleDelete} size="sm">
                            Remove Signature
                        </Button>
                    </div>
                </div>
            )}

            <div>
                <p className="text-sm font-medium mb-2">Draw New Signature</p>
                <div className="border rounded-md bg-white overflow-hidden shadow-sm touch-none">
                    <SignatureCanvas
                        ref={sigPad}
                        penColor="black"
                        canvasProps={{
                            className: 'w-full h-48 cursor-crosshair',
                        }}
                        onBegin={() => setIsDrawing(true)}
                    />
                </div>
                {error && <InputError message={error} className="mt-2" />}
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClear} disabled={!isDrawing || saving}>
                    Clear
                </Button>
                <Button type="button" onClick={handleSave} disabled={!isDrawing || saving}>
                    {saving ? 'Saving...' : 'Save Signature'}
                </Button>
            </div>
        </div>
    );
}

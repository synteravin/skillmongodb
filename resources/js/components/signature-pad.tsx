import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { router, usePage } from '@inertiajs/react';
import InputError from './input-error';
import { update, destroy } from '@/routes/profile/signature';
import { Type, PenTool, Upload, Trash2, Check } from 'lucide-react';
import ConfirmModal from './ui/ConfirmModal';

interface Props {
    currentSignatureUrl?: string;
}

const FONTS = [
    { name: 'Dancing Script', label: 'Dancing Script', family: 'Dancing Script' },
    { name: 'Great Vibes', label: 'Great Vibes', family: 'Great Vibes' },
    { name: 'Alex Brush', label: 'Alex Brush', family: 'Alex Brush' },
    { name: 'Caveat', label: 'Caveat', family: 'Caveat' },
];

const INK_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'Navy Blue', hex: '#0f172a' },
    { name: 'Royal Blue', hex: '#1e40af' },
];

function cropCanvas(sourceCanvas: HTMLCanvasElement): string {
    const ctx = sourceCanvas.getContext('2d');
    if (!ctx) return sourceCanvas.toDataURL('image/png');

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let minX = width, minY = height, maxX = 0, maxY = 0;
    let found = false;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 10) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }

    if (!found) return sourceCanvas.toDataURL('image/png');

    const padding = 12;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width, maxX + padding);
    maxY = Math.min(height, maxY + padding);

    const croppedWidth = maxX - minX;
    const croppedHeight = maxY - minY;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = croppedWidth;
    croppedCanvas.height = croppedHeight;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (croppedCtx) {
        croppedCtx.drawImage(sourceCanvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
    }

    return croppedCanvas.toDataURL('image/png');
}

export default function SignaturePad({ currentSignatureUrl }: Props) {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const [mode, setMode] = useState<'type' | 'draw' | 'upload'>('type');

    // Type mode state
    const [typedName, setTypedName] = useState(auth?.user?.name || '');
    const [selectedFont, setSelectedFont] = useState(FONTS[0].family);

    // Draw mode state
    const sigPad = useRef<SignatureCanvas>(null);
    const [penColor, setPenColor] = useState(INK_COLORS[0].hex);
    const [isDrawing, setIsDrawing] = useState(false);

    // Upload mode state
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleClearDraw = () => {
        sigPad.current?.clear();
        setIsDrawing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
                setError('Please select a PNG, JPG, or WEBP image.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError('File size must be less than 2MB.');
                return;
            }
            setError('');
            setUploadFile(file);
            const reader = new FileReader();
            reader.onload = () => setUploadPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveType = () => {
        if (!typedName.trim()) {
            setError('Please enter your name first.');
            return;
        }

        setSaving(true);
        setError('');

        const canvas = document.createElement('canvas');
        canvas.width = 650;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setSaving(false);
            setError('Failed to create canvas.');
            return;
        }

        ctx.font = `700 68px "${selectedFont}", cursive, serif`;
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2);

        const dataUrl = cropCanvas(canvas);

        router.post(
            update().url,
            { signature: dataUrl },
            {
                preserveScroll: true,
                onSuccess: () => setSaving(false),
                onError: (errors) => {
                    setSaving(false);
                    setError(errors.signature || 'Failed to save signature.');
                },
            }
        );
    };

    const handleSaveDraw = () => {
        if (!sigPad.current || sigPad.current.isEmpty()) {
            setError('Please provide a signature first.');
            return;
        }

        setSaving(true);
        setError('');

        const rawCanvas = sigPad.current.getCanvas();
        const dataUrl = cropCanvas(rawCanvas);

        router.post(
            update().url,
            { signature: dataUrl },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaving(false);
                    handleClearDraw();
                },
                onError: (errors) => {
                    setSaving(false);
                    setError(errors.signature || 'Failed to save signature.');
                },
            }
        );
    };

    const handleSaveUpload = () => {
        if (!uploadFile) {
            setError('Please select a signature image file.');
            return;
        }

        setSaving(true);
        setError('');

        const formData = new FormData();
        formData.append('signature_file', uploadFile);

        router.post(update().url, formData, {
            preserveScroll: true,
            onSuccess: () => setSaving(false),
            onError: (errors) => {
                setSaving(false);
                setError(errors.signature_file || errors.signature || 'Failed to save signature file.');
            },
        });
    };

    const executeDelete = () => {
        router.delete(destroy().url, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <ConfirmModal
                open={showDeleteConfirm}
                title="Remove Active Signature"
                message="Are you sure you want to remove your digital signature? Certificates will fallback to typed script signature until you set a new one."
                confirmText="Remove Signature"
                variant="danger"
                onConfirm={executeDelete}
                onClose={() => setShowDeleteConfirm(false)}
            />

            {/* Current Signature Display */}
            {currentSignatureUrl && (
                <div className="p-4 border border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-850 dark:text-slate-300">
                            Current Active Signature
                        </span>
                        <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)} size="sm" className="gap-1.5 h-8 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                        </Button>
                    </div>
                    <div className="border border-slate-300 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-950 p-4 inline-flex items-center justify-center min-w-[240px] max-w-md shadow-sm">
                        <img
                            src={currentSignatureUrl}
                            alt="Current active signature"
                            className="max-h-20 object-contain dark:invert"
                        />
                    </div>
                </div>
            )}

            {/* Mode Tabs */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900/60 p-1 border border-slate-300 dark:border-slate-800/80 gap-1">
                <button
                    type="button"
                    onClick={() => { setMode('type'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                        mode === 'type'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-800'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Type className="w-4 h-4" />
                    Ketik (Type)
                </button>
                <button
                    type="button"
                    onClick={() => { setMode('draw'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                        mode === 'draw'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-800'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <PenTool className="w-4 h-4" />
                    Gambar (Draw)
                </button>
                <button
                    type="button"
                    onClick={() => { setMode('upload'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                        mode === 'upload'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-800'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Upload className="w-4 h-4" />
                    Unggah (Upload)
                </button>
            </div>

            {/* Tab Contents */}
            {mode === 'type' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                            Enter Your Full Name
                        </label>
                        <input
                            type="text"
                            value={typedName}
                            onChange={(e) => setTypedName(e.target.value)}
                            placeholder="e.g. Narendra Wicaksono"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                            Choose Signature Font Style
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {FONTS.map((font) => (
                                <div
                                    key={font.family}
                                    onClick={() => setSelectedFont(font.family)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center relative ${
                                        selectedFont === font.family
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                                            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {selectedFont === font.family && (
                                        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold text-slate-400 mb-1">{font.label}</span>
                                    <span
                                        className="text-3xl text-slate-900 dark:text-slate-100 py-2 truncate max-w-full px-2"
                                        style={{ fontFamily: `'${font.family}', cursive, serif` }}
                                    >
                                        {typedName.trim() || 'Signature Preview'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <InputError message={error} className="mt-2" />}

                    <div className="flex justify-end">
                        <Button type="button" onClick={handleSaveType} disabled={saving || !typedName.trim()} className="cursor-pointer">
                            {saving ? 'Saving Signature...' : 'Save Type Signature'}
                        </Button>
                    </div>
                </div>
            )}

            {mode === 'draw' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Draw your signature on canvas below
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Ink Color:</span>
                            <div className="flex gap-1.5">
                                {INK_COLORS.map((ink) => (
                                    <button
                                        key={ink.hex}
                                        type="button"
                                        onClick={() => setPenColor(ink.hex)}
                                        className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                                            penColor === ink.hex ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-80'
                                        }`}
                                        style={{ backgroundColor: ink.hex }}
                                        title={ink.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-300 dark:border-slate-800 rounded-xl bg-white overflow-hidden shadow-sm touch-none dark:invert">
                        <SignatureCanvas
                            ref={sigPad}
                            penColor={penColor}
                            canvasProps={{
                                className: 'w-full h-56 cursor-crosshair bg-white',
                            }}
                            onBegin={() => setIsDrawing(true)}
                        />
                    </div>

                    {error && <InputError message={error} className="mt-2" />}

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearDraw}
                            disabled={!isDrawing || saving}
                            className="cursor-pointer"
                        >
                            Clear Canvas
                        </Button>
                        <Button type="button" onClick={handleSaveDraw} disabled={!isDrawing || saving} className="cursor-pointer">
                            {saving ? 'Saving Signature...' : 'Save Drawn Signature'}
                        </Button>
                    </div>
                </div>
            )}

            {mode === 'upload' && (
                <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-xl p-6 text-center border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                            id="signature-upload-input"
                        />
                        <label htmlFor="signature-upload-input" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-10 h-10 text-slate-400 mb-2" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Click to upload signature image
                            </span>
                            <span className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP (Max 2MB)</span>
                        </label>
                    </div>

                    {uploadPreview && (
                        <div className="p-4 border border-slate-300 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-center space-y-2">
                            <span className="text-xs text-slate-500 block">Selected File Preview:</span>
                            <img src={uploadPreview} alt="Upload preview" className="max-h-24 mx-auto object-contain" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block truncate">
                                {uploadFile?.name}
                            </span>
                        </div>
                    )}

                    {error && <InputError message={error} className="mt-2" />}

                    <div className="flex justify-end">
                        <Button type="button" onClick={handleSaveUpload} disabled={saving || !uploadFile} className="cursor-pointer">
                            {saving ? 'Uploading Signature...' : 'Save Uploaded Signature'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

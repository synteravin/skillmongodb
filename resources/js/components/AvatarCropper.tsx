import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

interface AvatarCropperProps {
    /** Object URL or data URL of the selected image */
    imageSrc: string;
    /** Called with a cropped File (JPEG) when user confirms */
    onConfirm: (croppedFile: File) => void;
    /** Called when user cancels — modal should be hidden by parent */
    onCancel: () => void;
    /** Output size in px (default 400) */
    outputSize?: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.1;

// Theme — single accent, in sync with SkillVentura command-center palette
const ACCENT = '#3B28F6';

export default function AvatarCropper({
    imageSrc,
    onConfirm,
    onCancel,
    outputSize = 400,
}: AvatarCropperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    // ── Detect dark mode (canvas can't read Tailwind `dark:` classes) ─────────
    const [isDark, setIsDark] = useState(
        typeof document !== 'undefined' &&
            document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains('dark'));
        });
        observer.observe(root, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    // ── Load image ────────────────────────────────────────────────────────────
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imgRef.current = img;
            setImageLoaded(true);
            setScale(1);
            setOffset({ x: 0, y: 0 });
        };
    }, [imageSrc]);

    // ── Draw onto the visible preview canvas ──────────────────────────────────
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img || !imageLoaded) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width; // square
        const radius = size / 2 - 2;
        ctx.clearRect(0, 0, size, size);

        // Fallback background (only visible behind transparent PNGs)
        ctx.fillStyle = isDark
            ? '#0f172a' /* slate-900 */
            : '#e2e8f0' /* slate-200 */;
        ctx.fillRect(0, 0, size, size);

        // Draw image centred + offset
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let drawW: number, drawH: number;

        if (imgAspect >= 1) {
            drawH = size * scale;
            drawW = drawH * imgAspect;
        } else {
            drawW = size * scale;
            drawH = drawW / imgAspect;
        }

        const cx = size / 2 + offset.x;
        const cy = size / 2 + offset.y;

        ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);

        // Dim OUTSIDE the circle only — single path w/ evenodd rule so the
        // image inside the circle is never touched/erased (fixes "covered" bug)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, size, size);
        ctx.moveTo(size / 2 + radius, size / 2);
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = isDark ? 'rgba(2,6,23,0.62)' : 'rgba(15,23,42,0.28)';
        ctx.fill('evenodd');
        ctx.restore();

        // Rule-of-thirds crosshair guide inside the circle (HUD framing aid)
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 2; i++) {
            const gx = (size / 3) * i;
            const gy = (size / 3) * i;
            ctx.beginPath();
            ctx.moveTo(gx, size / 2 - radius);
            ctx.lineTo(gx, size / 2 + radius);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(size / 2 - radius, gy);
            ctx.lineTo(size / 2 + radius, gy);
            ctx.stroke();
        }
        ctx.restore();

        // Accent ring border
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Outer glow ring
        ctx.strokeStyle = 'rgba(59,40,246,0.35)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius - 1, 0, Math.PI * 2);
        ctx.stroke();
    }, [imageLoaded, scale, offset, isDark]);

    useEffect(() => {
        draw();
    }, [draw]);

    // ── Mouse drag ────────────────────────────────────────────────────────────
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // ── Touch drag ────────────────────────────────────────────────────────────
    const handleTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const t = e.touches[0];
        setOffset({
            x: t.clientX - dragStart.x,
            y: t.clientY - dragStart.y,
        });
    };

    // ── Wheel zoom ────────────────────────────────────────────────────────────
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        setScale((s) =>
            Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * 0.001)),
        );
    };

    // ── Confirm: render onto offscreen canvas and export ─────────────────────
    const handleConfirm = () => {
        const img = imgRef.current;
        if (!img) return;

        const offscreen = document.createElement('canvas');
        offscreen.width = outputSize;
        offscreen.height = outputSize;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        // We need the preview canvas dimensions to calculate the same transform
        const previewSize = canvasRef.current?.width ?? 300;
        const ratio = outputSize / previewSize;

        const imgAspect = img.naturalWidth / img.naturalHeight;
        let drawW: number, drawH: number;

        if (imgAspect >= 1) {
            drawH = previewSize * scale * ratio;
            drawW = drawH * imgAspect;
        } else {
            drawW = previewSize * scale * ratio;
            drawH = drawW / imgAspect;
        }

        const cx = outputSize / 2 + offset.x * ratio;
        const cy = outputSize / 2 + offset.y * ratio;

        ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);

        offscreen.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], 'avatar.jpg', {
                    type: 'image/jpeg',
                });
                onConfirm(file);
            },
            'image/jpeg',
            0.92,
        );
    };

    // ── Responsive canvas size ─────────────────────────────────────────────────
    const [canvasSize, setCanvasSize] = useState(300);

    useEffect(() => {
        const update = () => {
            const w = Math.min(window.innerWidth - 64, 340);
            setCanvasSize(w);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const zoomPercent = Math.round(
        ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100,
    );

    return (
        /* Backdrop */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div
                ref={containerRef}
                className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/40 dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#0a0b14]"
            >
                {/* Dot-grid backdrop texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
                    style={{
                        backgroundImage:
                            'radial-gradient(currentColor 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                        color: ACCENT,
                    }}
                />

                {/* Top accent line */}
                <div className="absolute top-0 right-0 left-0 z-10 h-[2px] bg-[#3B28F6]" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                    {/* Corner brackets */}
                    <span className="absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-[#3B28F6]/60" />
                    <span className="absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-[#3B28F6]/60" />

                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3B28F6] opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3B28F6]" />
                        </span>
                        <h3 className="font-['Orbitron'] text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-white">
                            Adjust Photo
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="relative z-10 flex flex-col items-center gap-4 px-5 py-6">
                    <p className="-mt-1 flex items-center gap-1.5 text-center font-['Outfit'] text-[11px] text-slate-500 dark:text-slate-400">
                        <Move size={12} className="text-[#3B28F6]" />
                        Drag to reposition · Scroll or use slider to zoom
                    </p>

                    <div
                        className="relative cursor-grab overflow-hidden rounded-full active:cursor-grabbing"
                        style={{
                            width: canvasSize,
                            height: canvasSize,
                            borderRadius: '50%',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        <canvas
                            ref={canvasRef}
                            width={canvasSize}
                            height={canvasSize}
                            className="block select-none"
                            style={{ width: canvasSize, height: canvasSize }}
                        />
                    </div>

                    {/* Zoom readout */}
                    <span className="-mt-2 font-['Outfit'] text-[10px] tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        Zoom {zoomPercent}%
                    </span>

                    {/* Zoom Slider */}
                    <div className="flex w-full items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setScale((s) =>
                                    Math.max(MIN_SCALE, s - ZOOM_STEP),
                                )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition hover:border-[#3B28F6] hover:text-[#3B28F6] dark:border-slate-700 dark:text-slate-400"
                        >
                            <ZoomOut size={14} />
                        </button>

                        <input
                            type="range"
                            min={MIN_SCALE}
                            max={MAX_SCALE}
                            step={0.01}
                            value={scale}
                            onChange={(e) =>
                                setScale(parseFloat(e.target.value))
                            }
                            className="h-1.5 flex-1 cursor-pointer accent-[#3B28F6]"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setScale((s) =>
                                    Math.min(MAX_SCALE, s + ZOOM_STEP),
                                )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition hover:border-[#3B28F6] hover:text-[#3B28F6] dark:border-slate-700 dark:text-slate-400"
                        >
                            <ZoomIn size={14} />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 flex gap-3 px-5 pb-5">
                    {/* Corner brackets */}
                    <span className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-[#3B28F6]/30" />
                    <span className="absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 border-[#3B28F6]/30" />

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-slate-300 py-2.5 font-['Outfit'] text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3B28F6] py-2.5 font-['Outfit'] text-sm font-bold text-white shadow-[0_0_20px_rgba(59,40,246,0.35)] transition hover:bg-[#2c1cd6]"
                    >
                        <Check size={15} />
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

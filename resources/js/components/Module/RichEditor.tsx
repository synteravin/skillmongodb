import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    RotateCcw,
    Palette,
    Code2,
    Eye,
    X,
    Check,
} from 'lucide-react';

interface RichEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minHeight?: string;
    className?: string;
}

const COLOR_OPTIONS = [
    { label: 'Default', value: 'inherit', bg: 'bg-slate-400' },
    { label: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
    { label: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500' },
    { label: 'Emerald', value: '#10b981', bg: 'bg-emerald-500' },
    { label: 'Purple', value: '#a855f7', bg: 'bg-purple-500' },
    { label: 'Amber', value: '#f59e0b', bg: 'bg-amber-500' },
    { label: 'Rose', value: '#f43f5e', bg: 'bg-rose-500' },
    { label: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
];

const detectLanguage = (code: string): string => {
    const trimmed = code.trim();
    if (
        /\b(import|export|function|const|let|var|return|React|useState|useEffect)\b/m.test(trimmed) ||
        /className=/i.test(trimmed) ||
        /<[A-Z][a-zA-Z0-9]*/.test(trimmed)
    ) {
        return 'jsx';
    }
    if (/^\s*(<\?php|\$|echo\b)/i.test(trimmed)) return 'php';
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(trimmed)) return 'sql';
    if (/^\s*(\$|#|npm\b|git\b|composer\b|cd\b|docker\b)/m.test(trimmed)) return 'terminal';
    if (/^\s*[{[].*[}\]]$/s.test(trimmed)) return 'json';
    if (/:\s*[^;]+;/m.test(trimmed) && /[{}]/.test(trimmed)) return 'css';
    if (/<\/?[a-z1-6]+[^>]*>/i.test(trimmed)) return 'html';
    return 'jsx';
};

export default function RichEditor({
    value,
    onChange,
    placeholder = 'Tuliskan materi teks atau penjelasan di sini...',
    minHeight = '200px',
    className = '',
}: RichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showSource, setShowSource] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeSnippet, setCodeSnippet] = useState('');
    const [heading, setHeading] = useState<string>('p');

    const savedSelectionRef = useRef<Range | null>(null);

    // Active state tracker for toolbar buttons
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        unorderedList: false,
        orderedList: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        alignJustify: false,
        blockquote: false,
    });

    const updateActiveStates = useCallback(() => {
        if (!editorRef.current || showSource) return;
        try {
            setActiveStates({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough'),
                unorderedList: document.queryCommandState('insertUnorderedList'),
                orderedList: document.queryCommandState('insertOrderedList'),
                alignLeft: document.queryCommandState('justifyLeft'),
                alignCenter: document.queryCommandState('justifyCenter'),
                alignRight: document.queryCommandState('justifyRight'),
                alignJustify: document.queryCommandState('justifyFull'),
                blockquote: document.queryCommandValue('formatBlock') === 'blockquote',
            });
        } catch {
            // ignore queryCommandState errors
        }
    }, [showSource]);

    // Save selection before opening code modal
    const handleOpenCodeModal = () => {
        if (editorRef.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
                savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
            } else {
                savedSelectionRef.current = null;
            }
        }
        setShowCodeModal(true);
    };

    // Sync innerHTML when prop changes externally (e.g. initial load or reset)
    useEffect(() => {
        if (editorRef.current && !showSource) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value, showSource]);

    useEffect(() => {
        const handleSelectionChange = () => {
            updateActiveStates();
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [updateActiveStates]);

    const execCommand = (command: string, arg: string | undefined = undefined) => {
        if (showSource) return;
        editorRef.current?.focus();
        document.execCommand(command, false, arg);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const applyHeading = (hTag: string) => {
        setHeading(hTag);
        if (hTag === 'p') {
            execCommand('formatBlock', '<p>');
        } else {
            execCommand('formatBlock', `<${hTag}>`);
        }
    };

    const applyColor = (colorHex: string) => {
        execCommand('foreColor', colorHex);
        setShowColorPicker(false);
    };

    // Insert Code Block into the Editor at caret position
    const insertCodeBlock = () => {
        if (!codeSnippet.trim()) return;

        const lang = detectLanguage(codeSnippet);

        // Escape HTML entities to preserve raw code string inside pre code
        const escapedCode = codeSnippet
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const codeHtml = `<pre class="code-block" data-lang="${lang}"><code>${escapedCode}</code></pre><p><br></p>`;

        if (editorRef.current) {
            editorRef.current.focus();
            const sel = window.getSelection();
            if (savedSelectionRef.current && sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelectionRef.current);
            } else {
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }

            document.execCommand('insertHTML', false, codeHtml);
            onChange(editorRef.current.innerHTML);
        }

        setCodeSnippet('');
        setShowCodeModal(false);
        savedSelectionRef.current = null;
    };

    const getBtnStyle = (isActive: boolean) => {
        if (isActive) {
            return 'bg-[#3B28F6] text-white border-[#3B28F6] shadow-md dark:bg-[#7C5CFF] dark:border-[#7C5CFF] scale-105';
        }
        return 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-[#3B28F6] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-[#7C5CFF] active:scale-95 transition-all duration-150';
    };

    return (
        <div className={`overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs transition-all dark:border-slate-800 dark:bg-slate-950 ${className}`}>
            {/* TOOLBAR HEADER */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-100/90 p-2 sm:p-2.5 dark:border-slate-800 dark:bg-slate-900/90">
                {/* HEADINGS SELECT */}
                <select
                    value={heading}
                    onChange={(e) => applyHeading(e.target.value)}
                    className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none transition-all hover:border-indigo-300 focus:border-[#3B28F6] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-[#7C5CFF]"
                    title="Pilih Format Judul / Paragraf"
                >
                    <option value="p">Paragraf Biasa</option>
                    <option value="h1">Judul Utama (H1)</option>
                    <option value="h2">Sub Judul 1 (H2)</option>
                    <option value="h3">Sub Judul 2 (H3)</option>
                </select>

                <div className="mx-0.5 h-4 w-px bg-slate-300 dark:bg-slate-700" />

                {/* TEXT FORMATTING BUTTONS */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('bold')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.bold)}`}
                    title="Bold (Tebal)"
                >
                    <Bold size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('italic')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.italic)}`}
                    title="Italic (Miring)"
                >
                    <Italic size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('underline')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.underline)}`}
                    title="Underline (Garis Bawah)"
                >
                    <Underline size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('strikeThrough')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.strikeThrough)}`}
                    title="Strikethrough (Coret)"
                >
                    <Strikethrough size={14} />
                </button>

                <div className="mx-0.5 h-4 w-px bg-slate-300 dark:bg-slate-700" />

                {/* TEXT ALIGNMENT */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('justifyLeft')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.alignLeft)}`}
                    title="Rata Kiri"
                >
                    <AlignLeft size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('justifyCenter')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.alignCenter)}`}
                    title="Rata Tengah"
                >
                    <AlignCenter size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('justifyRight')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.alignRight)}`}
                    title="Rata Kanan"
                >
                    <AlignRight size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('justifyFull')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.alignJustify)}`}
                    title="Rata Kanan Kiri (Justify)"
                >
                    <AlignJustify size={14} />
                </button>

                <div className="mx-0.5 h-4 w-px bg-slate-300 dark:bg-slate-700" />

                {/* LISTS & QUOTE */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('insertUnorderedList')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.unorderedList)}`}
                    title="Bullet List (Daftar Poin)"
                >
                    <List size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('insertOrderedList')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.orderedList)}`}
                    title="Numbered List (Daftar Angka)"
                >
                    <ListOrdered size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('formatBlock', 'blockquote')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(activeStates.blockquote)}`}
                    title="Quote Block (Kutipan)"
                >
                    <Quote size={14} />
                </button>

                <div className="mx-0.5 h-4 w-px bg-slate-300 dark:bg-slate-700" />

                {/* INSERT CODE BLOCK BUTTON */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleOpenCodeModal}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-500/20 active:scale-95 dark:text-cyan-400"
                    title="Sisipkan Blok Kode / Syntax Editor"
                >
                    <Code2 size={14} />
                    <span className="hidden sm:inline">Kode</span>
                </button>

                {/* COLOR PALETTE */}
                <div className="relative">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${getBtnStyle(showColorPicker)}`}
                        title="Pilih Warna Teks"
                    >
                        <Palette size={14} />
                    </button>

                    {showColorPicker && (
                        <div className="absolute top-10 left-0 z-30 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => applyColor(c.value)}
                                    className={`h-5 w-5 rounded-full ${c.bg} border border-slate-300 transition-transform hover:scale-125 dark:border-slate-600`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => execCommand('removeFormat')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    title="Hapus Formatting Teks"
                >
                    <RotateCcw size={13} />
                </button>

                {/* HTML SOURCE TOGGLE */}
                <div className="ml-auto flex items-center">
                    <button
                        type="button"
                        onClick={() => setShowSource(!showSource)}
                        className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all ${
                            showSource
                                ? 'border-[#3B28F6] bg-[#3B28F6]/10 text-[#3B28F6] dark:text-[#7C5CFF]'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                        title="Toggle HTML Source Code Editor"
                    >
                        {showSource ? <Eye size={13} /> : <Code2 size={13} />}
                        <span>{showSource ? 'Visual Editor' : 'HTML Code'}</span>
                    </button>
                </div>
            </div>

            {/* EDITOR CONTENT AREA */}
            {showSource ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Source Code HTML..."
                    className="w-full resize-y bg-slate-950 p-4 font-mono text-xs text-sky-300 outline-none"
                    style={{ minHeight }}
                />
            ) : (
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onKeyUp={updateActiveStates}
                    onMouseUp={updateActiveStates}
                    onFocus={updateActiveStates}
                    data-placeholder={placeholder}
                    className="prose prose-slate max-w-none p-4 text-sm leading-relaxed text-slate-900 outline-none dark:prose-invert dark:text-slate-100 focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B28F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2.5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_p]:my-1.5"
                    style={{ minHeight }}
                />
            )}

            {/* MODAL / DIALOG UNTUK KODE */}
            {showCodeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#090d16] p-5 shadow-2xl dark:bg-[#050811]">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Code2 size={18} />
                                <h3 className="text-sm font-bold text-white">
                                    Kode
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCodeModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                    Tuliskan Kode / Syntax Teknis:
                                </label>
                                <textarea
                                    value={codeSnippet}
                                    onChange={(e) => setCodeSnippet(e.target.value)}
                                    placeholder="Paste atau tuliskan kode di sini..."
                                    className="min-h-[160px] w-full resize-y rounded-xl border border-slate-800 bg-[#040711] p-3.5 font-mono text-xs leading-relaxed text-cyan-300 outline-none focus:border-cyan-500"
                                    rows={6}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCodeModal(false)}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={insertCodeBlock}
                                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-cyan-500"
                                >
                                    <Check size={14} />
                                    <span>Kode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

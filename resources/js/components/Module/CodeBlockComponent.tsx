import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockComponentProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    className?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
    html: 'CODE SNIPPET / HTML',
    xml: 'CODE SNIPPET / XML',
    css: 'CODE SNIPPET / CSS',
    javascript: 'CODE SNIPPET / JAVASCRIPT',
    js: 'CODE SNIPPET / JAVASCRIPT',
    jsx: 'CODE SNIPPET / REACT JSX',
    typescript: 'CODE SNIPPET / TYPESCRIPT',
    ts: 'CODE SNIPPET / TYPESCRIPT',
    tsx: 'CODE SNIPPET / REACT TSX',
    php: 'CODE SNIPPET / PHP',
    sql: 'CODE SNIPPET / SQL',
    bash: 'COMMAND / TERMINAL',
    shell: 'COMMAND / TERMINAL',
    terminal: 'COMMAND / TERMINAL',
    cmd: 'COMMAND / TERMINAL',
    json: 'CODE SNIPPET / JSON',
    python: 'CODE SNIPPET / PYTHON',
    py: 'CODE SNIPPET / PYTHON',
    cpp: 'CODE SNIPPET / C++',
    java: 'CODE SNIPPET / JAVA',
    rust: 'CODE SNIPPET / RUST',
    go: 'CODE SNIPPET / GO',
    markdown: 'CODE SNIPPET / MARKDOWN',
    text: 'CODE SNIPPET / PLAIN TEXT',
};

// Check if raw code looks like JS/JSX/React code even if language was passed as 'html' or 'code'
function isJsxOrJs(code: string): boolean {
    const codeKeywordRegex = /\b(import|export|function|const|let|var|return|className|React|useState|useEffect)\b/;
    const jsxTagRegex = /<[A-Z][a-zA-Z0-9]*\b|<[a-z1-6]+\s+className=/;
    return codeKeywordRegex.test(code) || jsxTagRegex.test(code);
}

// Tokenizer for React JSX / TSX / JavaScript / TypeScript
function highlightJsxLine(line: string): React.ReactNode[] {
    if (!line) return ['\u00A0'];

    const parts: React.ReactNode[] = [];
    const tokenRegex =
        /(<!--[\s\S]*?-->|\/\/.+$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(<\/?(?:[A-Z][a-zA-Z0-9]*|[a-z1-6-]+))|([a-zA-Z0-9_-]+)=|(\/?>)|(\b(?:import|from|export|default|function|return|const|let|var|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|async|await|class|extends|interface|type|typeof|instanceof|void|delete|yield|in|of)\b)|(\b[A-Z][a-zA-Z0-9_$]*\b)|(\b\d+\b)|([{}()\[\];,.:<>=+\-*/@#]+)|([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

    let match;
    let prevKeyword = false;
    let lastIdx = 0;

    while ((match = tokenRegex.exec(line)) !== null) {
        // Preserve any spaces/whitespace before the matched token
        if (match.index > lastIdx) {
            parts.push(line.substring(lastIdx, match.index));
        }
        lastIdx = tokenRegex.lastIndex;

        const [
            full,
            comment,
            stringVal,
            tagStart,
            attrName,
            tagClose,
            keyword,
            capitalizedName,
            numberVal,
            operator,
            identifier,
        ] = match;

        if (comment) {
            parts.push(
                <span key={match.index} className="italic text-slate-500">
                    {comment}
                </span>
            );
            prevKeyword = false;
        } else if (stringVal) {
            parts.push(
                <span key={match.index} className="text-[#fbbf24] dark:text-[#f59e0b]">
                    {stringVal}
                </span>
            );
            prevKeyword = false;
        } else if (tagStart) {
            const isClosing = tagStart.startsWith('</');
            const tagName = tagStart.replace(/^<\/?/, '');
            const isComponent = /^[A-Z]/.test(tagName);

            parts.push(
                <span key={match.index}>
                    <span className="text-slate-400">{isClosing ? '</' : '<'}</span>
                    <span
                        className={
                            isComponent
                                ? 'font-semibold text-[#60a5fa]'
                                : 'font-semibold text-[#38bdf8]'
                        }
                    >
                        {tagName}
                    </span>
                </span>
            );
            prevKeyword = false;
        } else if (attrName) {
            parts.push(
                <span key={match.index}>
                    <span className="text-[#c084fc]">{attrName}</span>
                    <span className="text-slate-400">=</span>
                </span>
            );
            prevKeyword = false;
        } else if (tagClose) {
            parts.push(
                <span key={match.index} className="text-slate-400">
                    {tagClose}
                </span>
            );
            prevKeyword = false;
        } else if (keyword) {
            parts.push(
                <span key={match.index} className="font-semibold text-[#38bdf8]">
                    {keyword}
                </span>
            );
            prevKeyword = keyword === 'function' || keyword === 'class';
        } else if (capitalizedName) {
            parts.push(
                <span key={match.index} className="font-semibold text-[#60a5fa]">
                    {capitalizedName}
                </span>
            );
            prevKeyword = false;
        } else if (numberVal) {
            parts.push(
                <span key={match.index} className="text-[#fbbf24]">
                    {numberVal}
                </span>
            );
            prevKeyword = false;
        } else if (operator) {
            parts.push(
                <span key={match.index} className="text-slate-400">
                    {operator}
                </span>
            );
            prevKeyword = false;
        } else if (identifier) {
            if (prevKeyword) {
                parts.push(
                    <span key={match.index} className="font-semibold text-[#60a5fa]">
                        {identifier}
                    </span>
                );
            } else {
                parts.push(
                    <span key={match.index} className="text-slate-100">
                        {identifier}
                    </span>
                );
            }
            prevKeyword = false;
        } else {
            parts.push(
                <span key={match.index} className="text-slate-300">
                    {full}
                </span>
            );
            prevKeyword = false;
        }
    }

    if (lastIdx < line.length) {
        parts.push(line.substring(lastIdx));
    }

    return parts.length > 0 ? parts : [line];
}

// Tokenizer for HTML / XML
function highlightHtmlLine(line: string): React.ReactNode[] {
    if (!line) return ['\u00A0'];
    const parts: React.ReactNode[] = [];
    const regex =
        /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9-]+)|([a-zA-Z0-9-]+)=("[^"]*"|'[^']*')|(\/?>)/g;
    let match;
    let lastIdx = 0;

    while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIdx) {
            parts.push(line.substring(lastIdx, match.index));
        }
        lastIdx = regex.lastIndex;

        const [full, comment, tag, attrName, attrVal, tagClose] = match;
        if (comment) {
            parts.push(
                <span key={match.index} className="italic text-slate-500">
                    {comment}
                </span>
            );
        } else if (tag) {
            parts.push(
                <span key={match.index} className="font-semibold text-[#38bdf8]">
                    {tag}
                </span>
            );
        } else if (attrName && attrVal) {
            parts.push(
                <span key={match.index}>
                    <span className="text-[#c084fc]">{attrName}</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-[#fbbf24]">{attrVal}</span>
                </span>
            );
        } else if (tagClose) {
            parts.push(
                <span key={match.index} className="font-semibold text-[#38bdf8]">
                    {tagClose}
                </span>
            );
        }
    }

    if (lastIdx < line.length) {
        parts.push(line.substring(lastIdx));
    }

    return parts.length > 0 ? parts : [line];
}

// Tokenizer for Terminal / Shell commands
function highlightTerminalLine(line: string): React.ReactNode[] {
    if (
        line.trim().startsWith('$') ||
        line.trim().startsWith('#') ||
        line.trim().startsWith('>')
    ) {
        const prompt = line.substring(0, 1);
        const rest = line.substring(1);
        return [
            <span key="prompt" className="mr-2 font-bold text-rose-400">
                {prompt}
            </span>,
            <span key="cmd" className="font-semibold text-sky-300">
                {rest}
            </span>,
        ];
    }
    return [<span key="out" className="text-slate-300">{line}</span>];
}

// Main syntax highlighter dispatcher
function highlightLine(
    line: string,
    lang: string = 'html',
    fullCode: string = ''
): React.ReactNode[] {
    const l = lang.toLowerCase().trim();

    if (!line) return ['\u00A0'];

    if (['bash', 'shell', 'terminal', 'cmd'].includes(l)) {
        return highlightTerminalLine(line);
    }

    if (
        ['jsx', 'tsx', 'js', 'javascript', 'ts', 'typescript'].includes(l) ||
        isJsxOrJs(fullCode)
    ) {
        return highlightJsxLine(line);
    }

    if (l === 'html' || l === 'xml') {
        return highlightHtmlLine(line);
    }

    return highlightJsxLine(line);
}

export default function CodeBlockComponent({
    code,
    language = 'jsx',
    title,
    showLineNumbers = true,
    className = '',
}: CodeBlockComponentProps) {
    const [copied, setCopied] = useState(false);

    const normLang = (language || 'jsx').toLowerCase().trim();
    const effectiveLang = isJsxOrJs(code || '') ? 'jsx' : normLang;
    const displayLabel =
        LANGUAGE_LABELS[effectiveLang] ||
        `CODE SNIPPET / ${effectiveLang.toUpperCase()}`;

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = (code || '').split('\n');

    return (
        <div
            className={`my-4 overflow-hidden rounded-xl border border-slate-800 bg-[#090d16] shadow-lg dark:border-slate-800/90 dark:bg-[#040711] ${className}`}
        >
            {/* TOP BAR / IDE HEADER */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/90 bg-[#0d121f] px-4 py-2.5 sm:px-5 dark:border-slate-800 dark:bg-[#070b15]">
                {/* MAC WINDOW DOTS & OPTIONAL TITLE */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.4)]" />
                        <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.4)]" />
                        <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.4)]" />
                    </div>
                    {title && (
                        <span className="ml-2 font-mono text-xs font-semibold text-slate-300">
                            {title}
                        </span>
                    )}
                </div>

                {/* RIGHT HEADER: LANGUAGE BADGE & COPY BUTTON */}
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-slate-400 sm:text-xs">
                        {displayLabel}
                    </span>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
                        title="Copy Code"
                    >
                        {copied ? (
                            <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="font-semibold text-emerald-400">
                                    Copied!
                                </span>
                            </>
                        ) : (
                            <>
                                <Copy size={12} className="opacity-70" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* CODE BODY WITH LINE NUMBERS */}
            <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-100 sm:p-5 sm:text-sm">
                <table className="w-full border-collapse">
                    <tbody>
                        {lines.map((line, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30">
                                {showLineNumbers && (
                                    <td className="w-10 pr-4 text-right font-mono text-xs text-slate-600 select-none align-top">
                                        {idx + 1}.
                                    </td>
                                )}
                                <td className="whitespace-pre align-top font-mono">
                                    {highlightLine(line, effectiveLang, code)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

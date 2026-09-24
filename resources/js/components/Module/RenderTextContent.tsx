import React from 'react';
import CodeBlockComponent from './CodeBlockComponent';

interface RenderTextContentProps {
    description?: string;
    code?: string;
    language?: string;
    type?: string;
    className?: string;
}

function unescapeHtml(escapedStr: string): string {
    return escapedStr
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

export default function RenderTextContent({
    description = '',
    code,
    language,
    type,
    className = '',
}: RenderTextContentProps) {
    // If explicitly type === 'code' or code property exists
    if (type === 'code' || code) {
        return (
            <CodeBlockComponent
                code={code || description || ''}
                language={language || 'html'}
                className={className}
            />
        );
    }

    if (!description && !code) return null;

    const textToRender = description || code || '';

    // Check if text is rich HTML (from RichEditor toolbar)
    const isRichHtml = (text: string) => {
        const trimmed = text.trim();
        const richTagsRegex = /<\/?(h1|h2|h3|h4|p|span|b|i|u|s|em|strong|ul|ol|li|blockquote|a|div|pre)\b[^>]*>/i;
        return richTagsRegex.test(trimmed);
    };

    // Helper to check if raw unformatted string looks like code snippet
    const isRawCodeBlock = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return false;
        const codeKeywordRegex = /^(import|export|const|let|var|function|class|if|for|while|return|public|private)\s/m;
        const lines = trimmed.split('\n');
        let count = 0;
        for (const l of lines) {
            const t = l.trim();
            if (codeKeywordRegex.test(t) || t.startsWith('//') || t.startsWith('<!--')) {
                count++;
            }
        }
        return count > 0 && count >= lines.length * 0.4;
    };

    const renderContent = () => {
        // If embedded <pre class="code-block" data-lang="..."><code>...</code></pre> exists
        if (textToRender.includes('code-block')) {
            const regex = /<pre\s+class="code-block"\s+data-lang="([^"]*)">\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/gi;
            const elements: React.ReactNode[] = [];
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(textToRender)) !== null) {
                const preText = textToRender.substring(lastIndex, match.index);
                if (preText.trim()) {
                    if (isRichHtml(preText)) {
                        elements.push(
                            <div
                                key={`html-${match.index}`}
                                dangerouslySetInnerHTML={{ __html: preText }}
                                className="prose prose-slate max-w-none text-slate-800 leading-relaxed dark:prose-invert dark:text-slate-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B28F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2"
                            />
                        );
                    } else {
                        elements.push(renderPlainParagraphs(preText, `pre-${match.index}`));
                    }
                }

                const lang = match[1] || 'html';
                const rawCode = unescapeHtml(match[2] || '');

                elements.push(
                    <CodeBlockComponent
                        key={`code-${match.index}`}
                        code={rawCode}
                        language={lang}
                    />
                );

                lastIndex = regex.lastIndex;
            }

            const postText = textToRender.substring(lastIndex);
            if (postText.trim()) {
                if (isRichHtml(postText)) {
                    elements.push(
                        <div
                            key="post-html"
                            dangerouslySetInnerHTML={{ __html: postText }}
                            className="prose prose-slate max-w-none text-slate-800 leading-relaxed dark:prose-invert dark:text-slate-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B28F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2"
                        />
                    );
                } else {
                    elements.push(renderPlainParagraphs(postText, 'post'));
                }
            }

            return elements;
        }

        // If markdown fenced code blocks exist
        if (textToRender.includes('```')) {
            const parts = textToRender.split(/(```[\s\S]*?```)/g);
            return parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const contentWithLang = part.slice(3, -3).trim();
                    const firstNewline = contentWithLang.indexOf('\n');
                    let lang = 'html';
                    let rawCode = contentWithLang;

                    if (firstNewline !== -1) {
                        const possibleLang = contentWithLang.slice(0, firstNewline).trim();
                        if (possibleLang && !possibleLang.includes(' ') && possibleLang.length < 15) {
                            lang = possibleLang;
                            rawCode = contentWithLang.slice(firstNewline + 1);
                        }
                    }

                    return (
                        <CodeBlockComponent
                            key={index}
                            code={rawCode}
                            language={lang}
                        />
                    );
                }

                if (isRichHtml(part)) {
                    return (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: part }}
                            className="prose prose-slate max-w-none text-slate-800 leading-relaxed dark:prose-invert dark:text-slate-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B28F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2"
                        />
                    );
                }

                return renderPlainParagraphs(part, index);
            });
        }

        // If rich HTML from RichEditor
        if (isRichHtml(textToRender)) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: textToRender }}
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed dark:prose-invert dark:text-slate-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B28F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2"
                />
            );
        }

        // If raw code lines
        if (isRawCodeBlock(textToRender)) {
            return (
                <CodeBlockComponent
                    code={textToRender}
                    language={language || 'html'}
                />
            );
        }

        // Default plain text paragraphs
        return renderPlainParagraphs(textToRender, 'plain');
    };

    const renderPlainParagraphs = (text: string, keyPrefix: number | string) => {
        const blocks = text.split(/\n\s*\n/);
        return blocks.map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;
            return (
                <p
                    key={`${keyPrefix}-${idx}`}
                    className="mb-3 text-sm font-normal leading-relaxed text-slate-800 break-words whitespace-pre-wrap last:mb-0 sm:text-base dark:text-slate-100"
                    style={{ wordBreak: 'break-word' }}
                >
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className={`w-full text-left ${className}`}>
            {renderContent()}
        </div>
    );
}

<?php

$srsDir = __DIR__.'/../docs/srs';
$outputFile = $srsDir.'/srs_master_document.html';

// Order of files to merge
$files = [
    $srsDir.'/srs_master_specification.md',
    $srsDir.'/srs_uml_diagrams.md',
    $srsDir.'/srs_professional_analysis.md',
    $srsDir.'/srs_api_and_database.md',
    $srsDir.'/srs_compliance_report.md',
];

$mergedMarkdown = '';

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);

        // Remove title headers to prevent duplicate titles in single document
        // (except for srs_master_specification.md which has the main title)
        if (basename($file) !== 'srs_master_specification.md') {
            $content = preg_replace('/^#\s+.+$/m', '', $content, 1);
        }

        $mergedMarkdown .= "\n\n---\n\n".$content;
    }
}

// Escape backticks and script tags for embedding safely
$escapedMarkdown = str_replace(
    ['\\', '`', '<script', '</script>'],
    ['\\\\', '\\`', '\\<script', '\\</script\\>'],
    $mergedMarkdown
);

$htmlShell = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillMongo - Master SRS & Architecture Specification</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Outfit:wght@400;600;800&family=Oxanium:wght@500;700;800&display=swap" rel="stylesheet">
    
    <!-- Marked.js (Markdown Parser) -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <!-- Mermaid.js (Diagram Renderer) -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    
    <style>
        :root {
            --primary: #4f46e5;
            --primary-hover: #4338ca;
            --text-dark: #0f172a;
            --text-light: #475569;
            --bg-light: #f8fafc;
            --border-color: #e2e8f0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            color: var(--text-dark);
            line-height: 1.6;
            background-color: var(--bg-light);
            margin: 0;
            padding: 0;
        }

        /* Top Action Bar */
        .action-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 100;
        }

        .logo {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: 1.2rem;
            color: var(--primary);
            letter-spacing: 0.1em;
        }

        .btn-print {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-print:hover {
            background-color: var(--primary-hover);
        }

        /* Main Container */
        .container {
            max-width: 900px;
            margin: 100px auto 60px auto;
            background-color: white;
            padding: 48px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid var(--border-color);
        }

        /* Markdown Styling overrides */
        #content {
            font-size: 1rem;
        }

        #content h1 {
            font-family: 'Oxanium', sans-serif;
            font-weight: 800;
            color: #1e1b4b;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 12px;
            margin-top: 40px;
            page-break-before: always;
        }

        #content h1:first-child {
            page-break-before: avoid;
            margin-top: 0;
        }

        #content h2 {
            font-family: 'Oxanium', sans-serif;
            font-weight: 700;
            color: #312e81;
            margin-top: 32px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
        }

        #content h3 {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            color: #4338ca;
            margin-top: 24px;
        }

        #content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.9rem;
        }

        #content th, #content td {
            border: 1px solid var(--border-color);
            padding: 10px 12px;
            text-align: left;
        }

        #content th {
            background-color: #f1f5f9;
            font-weight: 800;
        }

        #content tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        #content pre {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            overflow-x: auto;
        }

        #content code {
            font-family: 'Courier New', Courier, monospace;
            background-color: #f1f5f9;
            color: #c084fc;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
        }

        #content pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
            font-size: 0.9em;
        }

        #content blockquote {
            border-left: 4px solid var(--primary);
            margin: 20px 0;
            padding: 8px 16px;
            background-color: #e0e7ff/20;
            color: var(--text-light);
            font-style: italic;
        }

        .mermaid {
            display: flex;
            justify-content: center;
            margin: 28px 0;
            background-color: #fafafa;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        /* Print optimization stylesheet */
        @media print {
            .action-bar {
                display: none !important;
            }
            body {
                background-color: white;
            }
            .container {
                box-shadow: none;
                border: none;
                margin: 0;
                padding: 0;
                max-width: 100%;
            }
            #content h1 {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>

    <div class="action-bar">
        <div class="logo">SKILLMONGO SRS</div>
        <button class="btn-print" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Cetak PDF
        </button>
    </div>

    <div class="container">
        <div id="content">Memuat spesifikasi dokumen...</div>
    </div>

    <script>
        // Embed the escaped markdown
        const rawMarkdown = `{$escapedMarkdown}`;

        // Initialize mermaid with custom theme
        mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
        });

        // Set custom marked parser to handle mermaid codeblocks
        marked.use({
            renderer: {
                code({ text, lang }) {
                    if (lang === 'mermaid') {
                        return '<div class="mermaid">' + text + '</div>';
                    }
                    return '<pre><code class="language-' + (lang || '') + '">' + text + '</code></pre>';
                }
            }
        });

        // Parse and render
        document.getElementById('content').innerHTML = marked.parse(rawMarkdown);

        // Render diagram async
        mermaid.run();
    </script>
</body>
</html>
HTML;

file_put_contents($outputFile, $htmlShell);
echo 'Sukses: Master HTML SRS dokumen berhasil dibuat di '.$outputFile."\n";

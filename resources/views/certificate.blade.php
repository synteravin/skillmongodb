<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Certificate of Achievement</title>

    <style>
        @page {
            margin: 0;
        }

        body {
            margin: 0;
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            background: #0a0f2c;
            color: #e2e8f0;
        }

        /* Container */
        .container {
            width: 100%;
            height: 100vh;
            padding: 60px;
            box-sizing: border-box;
            background: radial-gradient(circle at top, #1e293b, #020617);
            border: 12px solid #1e293b;
            position: relative;
        }

        /* Accent line */
        .container::before {
            content: "";
            position: absolute;
            top: 40px;
            left: 60px;
            right: 60px;
            height: 2px;
            background: linear-gradient(to right, transparent, #38bdf8, transparent);
        }

        /* Header */
        .header {
            margin-top: 60px;
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #38bdf8;
            text-transform: uppercase;
        }

        .subheader {
            margin-top: 10px;
            font-size: 14px;
            letter-spacing: 3px;
            color: #94a3b8;
            text-transform: uppercase;
        }

        /* Content */
        .content {
            margin-top: 80px;
        }

        .presented-to {
            font-size: 16px;
            color: #94a3b8;
            margin-bottom: 10px;
        }

        .name {
            font-size: 40px;
            font-weight: 700;
            color: #facc15;
            margin: 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #38bdf8;
            display: inline-block;
        }

        .reason {
            margin-top: 25px;
            font-size: 16px;
            color: #cbd5f5;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        .course {
            font-size: 22px;
            font-weight: 600;
            color: #34d399;
            margin-top: 15px;
        }

        /* Module */
        .module {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 8px;
        }

        /* Badge */
        .grade-badge {
            margin-top: 40px;
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            padding: 12px 28px;
            border-radius: 999px;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        /* Footer */
        .footer {
            margin-top: 90px;
            display: flex;
            justify-content: space-between;
            padding: 0 40px;
        }

        .signature-block {
            text-align: center;
        }

        .signature-line {
            width: 220px;
            border-bottom: 1px solid #94a3b8;
            margin-bottom: 10px;
        }

        .signature-name {
            font-family: 'Brush Script MT', cursive;
            font-size: 22px;
            color: #38bdf8;
            margin-bottom: 5px;
        }

        .footer-text {
            font-size: 12px;
            color: #94a3b8;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="header">Certificate of Achievement</div>
        <div class="subheader">Awarded for Excellence</div>

        <div class="content">
            <div class="presented-to">This certificate is proudly presented to</div>

            <div class="name">{{ $studentName }}</div>

            <div class="reason">
                for successfully completing and demonstrating outstanding performance in
            </div>

            <div class="course">{{ $assignmentTitle }}</div>

            @if(isset($groupName))
                <div class="module">Module: {{ $groupName }}</div>
            @endif

            <div class="grade-badge">
                Final Score: {{ $grade }} / 100
            </div>
        </div>

        <div class="footer">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="footer-text">{{ $date }}</div>
                <div class="footer-text">Date of Issue</div>
            </div>

            <div class="signature-block">
                <div class="signature-name">{{ $mentorName }}</div>
                <div class="signature-line"></div>
                <div class="footer-text">Mentor Signature</div>
            </div>
        </div>

    </div>
</body>

</html>
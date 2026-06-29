<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Certificate of Recognition</title>

    <link
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Montserrat:wght@400;700&display=swap"
        rel="stylesheet">

    <style>
        @page {
            margin: 0px;
            size: A4 landscape;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', sans-serif;
            color: #0f294a;
            width: 100%;
            height: 100vh;
            background-color: #FCF8F2;
        }

        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .certificate-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        /* Semi-transparent center card */
        .card {
            position: absolute;
            top: 11%;
            left: 9%;
            right: 9%;
            height: 48%;
            background: rgba(255, 255, 255, 0.90);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.7);
            padding: 20px 40px;
            text-align: center;
            box-sizing: border-box;
        }

        .logo-container {
            margin-bottom: 8px;
            text-align: center;
            width: 100%;
        }

        .logo-container img {
            width: 90px;
            height: auto;
        }

        .cert-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #0f294a;
            letter-spacing: 5px;
            margin-top: 5px;
            margin-bottom: 2px;
            text-transform: uppercase;
        }

        .divider-container {
            width: 100%;
            text-align: center;
            margin: 8px 0;
        }

        .divider-line {
            display: inline-block;
            width: 280px;
            height: 1px;
            background-color: #cbd5e1;
            position: relative;
        }

        .divider-accent {
            position: absolute;
            top: -2px;
            left: 120px;
            width: 40px;
            height: 5px;
            background-color: #eab308;
            border-radius: 2px;
        }

        .awarded-to {
            font-size: 11px;
            color: #5D7290;
            font-weight: 600;
            letter-spacing: 2px;
            margin-top: 12px;
            text-transform: uppercase;
        }

        .name {
            font-family: 'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', serif;
            font-size: 50px;
            font-weight: 700;
            color: #1e3a8a;
            line-height: 1.2;
            font-style: italic;
            margin-top: 4px;
            margin-bottom: 8px;
        }

        .description {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
            max-width: 80%;
            margin: 0 auto;
        }

        /* Bottom section with signatures and date */
        .footer {
            width: 100%;
        }

        .signature-block-left {
            position: absolute;
            bottom: 11%;
            left: 12%;
            width: 240px;
            text-align: center;
        }

        .signature-block-right {
            position: absolute;
            bottom: 11%;
            right: 12%;
            width: 240px;
            text-align: center;
        }

        .date-block-center {
            position: absolute;
            bottom: 11%;
            left: 50%;
            width: 200px;
            margin-left: -100px;
            text-align: center;
        }

        .signature-box {
            height: 55px;
            line-height: 55px;
            vertical-align: bottom;
            text-align: center;
            margin-bottom: 2px;
        }

        .signature-img {
            max-height: 52px;
            max-width: 180px;
            display: inline-block;
            vertical-align: bottom;
        }

        .signature-fallback-text {
            font-family: 'Dancing Script', 'Alex Brush', cursive, serif;
            font-size: 28px;
            font-weight: 700;
            color: #0f294a;
            display: inline-block;
            line-height: 50px;
        }

        .signature-line {
            width: 100%;
            border-top: 1.5px solid #bda88e;
            margin-top: 2px;
            margin-bottom: 6px;
        }

        .signer-name {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #0f294a;
        }

        .signer-id {
            font-size: 10px;
            color: #5D7290;
            margin-top: 1px;
            margin-bottom: 2px;
        }

        .signer-title {
            font-size: 10px;
            font-weight: 600;
            color: #64748B;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .date-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #0f294a;
        }
    </style>
</head>

<body>
    @if(file_exists(public_path('images/Sertifikat Course LMS SkillVentura.png')))
        <img src="{{ public_path('images/Sertifikat Course LMS SkillVentura.png') }}" class="background" alt="Certificate Background">
    @else
        <img src="{{ public_path('images/Sertifikat Course LMS SkillVentura.jpg') }}" class="background" alt="Certificate Background">
    @endif

    <div class="certificate-content">

        <!-- Semi-transparent Center Card -->
        <div class="card">
            @if(file_exists(public_path('images/[WithoutBG]SVLogo (2).png')))
                <div class="logo-container">
                    <img src="{{ public_path('images/[WithoutBG]SVLogo (2).png') }}" alt="SkillVentura Logo">
                </div>
            @endif

            <div class="cert-title">Certificate of Recognition</div>

            <div class="divider-container">
                <div class="divider-line">
                    <div class="divider-accent"></div>
                </div>
            </div>

            <div class="awarded-to">This Certificate is proudly awarded to:</div>

            <div class="name">{{ $studentName }}</div>

            <div class="description">
                This certificate is given to <strong>{{ $studentName }}</strong> for their achievement in <strong>{{ $assignmentTitle }}</strong> and proves that they are competent in their field.
            </div>
        </div>

        <!-- Footer Signatures & Date Section -->
        <div class="footer">
            <!-- Left Block: Admin / Guild Master -->
            <div class="signature-block-left">
                <div class="signature-box">
                    @if(isset($adminSignature) && $adminSignature)
                        <img src="{{ $adminSignature }}" class="signature-img" alt="Admin Signature">
                    @endif
                </div>
                <div class="signature-line"></div>
                <div class="signer-name">{{ $adminName ?? 'Guild Master' }}</div>
                <div class="signer-title">Guild Master</div>
            </div>

            <!-- Center Block: Date Issued -->
            <div class="date-block-center">
                <div class="signature-box"></div>
                <div class="signature-line"></div>
                <div class="date-text">{{ $date }}</div>
                <div class="signer-title">Date Issued</div>
            </div>

            <!-- Right Block: Mentor -->
            <div class="signature-block-right">
                <div class="signature-box">
                    @if(isset($mentorSignature) && $mentorSignature)
                        <img src="{{ $mentorSignature }}" class="signature-img" alt="Mentor Signature">
                    @endif
                </div>
                <div class="signature-line"></div>
                <div class="signer-name">{{ $mentorName }}</div>
                <div class="signer-title">Mentor</div>
            </div>
        </div>

    </div>
</body>

</html>
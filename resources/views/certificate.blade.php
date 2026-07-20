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
            top: 13%;
            left: 9%;
            right: 9%;
            height: 46%;
            background: rgba(255, 255, 255, 0.94);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.8);
            padding: 18px 40px;
            text-align: center;
            box-sizing: border-box;
        }

        .logo-container {
            margin-bottom: 6px;
            text-align: center;
            width: 100%;
        }

        .logo-container img {
            height: 105px;
            width: auto;
            max-width: 250px;
        }

        .cert-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #0f294a;
            letter-spacing: 6px;
            margin-top: 2px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }

        .divider-container {
            width: 100%;
            text-align: center;
            margin: 6px 0 10px 0;
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
            color: #64748b;
            font-weight: 600;
            letter-spacing: 2.5px;
            margin-top: 6px;
            text-transform: uppercase;
        }

        .name {
            font-family: 'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', serif;
            font-size: 48px;
            font-weight: 700;
            color: #1e3a8a;
            line-height: 1.15;
            font-style: italic;
            margin-top: 6px;
            margin-bottom: 10px;
        }

        .description {
            font-size: 14px;
            color: #475569;
            line-height: 1.5;
            max-width: 88%;
            margin: 0 auto;
        }

        /* Bottom section with signatures and date */
        .footer {
            width: 100%;
        }

        .signature-block-left {
            position: absolute;
            bottom: 8%;
            left: 10%;
            width: 250px;
            text-align: center;
        }

        .signature-block-right {
            position: absolute;
            bottom: 8%;
            right: 10%;
            width: 250px;
            text-align: center;
        }

        .date-block-center {
            position: absolute;
            bottom: 8%;
            left: 50%;
            width: 210px;
            margin-left: -105px;
            text-align: center;
        }

        .signature-box {
            height: 75px;
            line-height: 75px;
            vertical-align: bottom;
            text-align: center;
            margin-bottom: 2px;
        }

        .signature-img {
            max-height: 70px;
            max-width: 220px;
            display: inline-block;
            vertical-align: bottom;
        }

        .signature-fallback-text {
            font-family: 'Dancing Script', 'Alex Brush', cursive, serif;
            font-size: 38px;
            font-weight: 700;
            color: #1e293b;
            display: inline-block;
            line-height: 70px;
        }

        .signature-line {
            width: 100%;
            border-top: 1.5px solid #cbd5e1;
            margin-top: 2px;
            margin-bottom: 6px;
        }

        .signer-name {
            font-family: 'Montserrat', sans-serif;
            font-size: 13.5px;
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
            font-size: 9.5px;
            font-weight: 600;
            color: #64748B;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .date-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 13.5px;
            font-weight: 700;
            color: #0f294a;
        }
    </style>
</head>

<body>
    @if(isset($backgroundImage) && $backgroundImage)
        <img src="{{ $backgroundImage }}" class="background" alt="Certificate Background">
    @elseif(file_exists(public_path('images/Sertifikat Course LMS SkillVentura.png')))
        <img src="{{ public_path('images/Sertifikat Course LMS SkillVentura.png') }}" class="background" alt="Certificate Background">
    @else
        <img src="{{ public_path('images/Sertifikat Course LMS SkillVentura.jpg') }}" class="background" alt="Certificate Background">
    @endif

    <div class="certificate-content">

        <!-- Semi-transparent Center Card -->
        <div class="card">
            @if(isset($logoImage) && $logoImage)
                <div class="logo-container">
                    <img src="{{ $logoImage }}" alt="Certificate Logo">
                </div>
            @elseif(file_exists(public_path('images/[WithoutBG]SVLogo (2).png')))
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
                    @else
                        <span class="signature-fallback-text">{{ $adminName ?? 'Guild Master' }}</span>
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
                    @else
                        <span class="signature-fallback-text">{{ $mentorName }}</span>
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
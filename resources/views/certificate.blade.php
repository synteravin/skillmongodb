<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Certificate of Achievement</title>

    <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Dancing+Script:wght@600;700&family=Montserrat:wght@400;500;600&display=swap"
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
            color: #333333;
            width: 100%;
            height: 100vh;
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

        .logo-container {
            position: absolute;
            top: 50px;
            right: 80px;
            width: 130px;
        }

        .logo-container img {
            max-width: 100%;
            height: auto;
        }

        .header-container {
            position: absolute;
            top: 14%;
            left: 0;
            width: 100%;
            text-align: center;
        }

        .cert-title {
            font-family: 'Cinzel', serif;
            font-size: 26px;
            color: #1a56a6;
            letter-spacing: 12px;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .cert-subtitle {
            font-family: 'Cinzel', serif;
            font-size: 48px;
            font-weight: 700;
            color: #1a56a6;
            letter-spacing: 6px;
        }

        .awarded-to {
            position: absolute;
            top: 33%;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 18px;
            color: #666666;
            font-weight: 500;
            letter-spacing: 1px;
        }

        .name-container {
            position: absolute;
            top: 40%;
            left: 0;
            width: 100%;
            text-align: center;
        }

        .name {
            font-family: 'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', serif;
            font-size: 85px;
            font-weight: 700;
            color: #1a56a6;
            line-height: 1;
            font-style: italic;
        }

        .description-container {
            position: absolute;
            top: 59%;
            left: 15%;
            width: 70%;
            text-align: center;
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
        }

        .footer {
            position: absolute;
            bottom: 14%;
            left: 0;
            width: 100%;
        }

        .signature-block-left {
            position: absolute;
            left: 16%;
            width: 210px;
            text-align: center;
        }

        .signature-block-right {
            position: absolute;
            right: 16%;
            width: 210px;
            text-align: center;
        }

        .signature-line {
            width: 100%;
            border-top: 1px solid #888888;
            margin-bottom: 8px;
        }

        .signer-name {
            font-family: 'Times New Roman', Times, serif;
            font-size: 20px;
            font-weight: bold;
            color: #444444;
            margin-bottom: 4px;
        }

        .signer-title {
            font-size: 15px;
            color: #777777;
        }
    </style>
</head>

<body>
    <img src="{{ public_path('images/certificate.png') }}" class="background" alt="Certificate Background">

    <div class="certificate-content">

        @if(file_exists(public_path('images/[WithoutBG]SVLogo (2).png')))
            <div class="logo-container">
                <img src="{{ public_path('images/[WithoutBG]SVLogo (2).png') }}" alt="SkillVentura Logo">
            </div>
        @endif

        <div class="header-container">
            <div class="cert-title">CERTIFICATE</div>
            <div class="cert-subtitle">OF RECOGNITION</div>
        </div>

        <div class="awarded-to">This Certificate is proudly awarded to:</div>

        <div class="name-container">
            <div class="name">{{ $studentName }}</div>
        </div>

        <div class="description-container">
            This certificate is given to {{ $studentName }}<br>
            for their achievement in {{ $assignmentTitle }}<br>
            and proves that they are competent in their field.
        </div>

        <div class="footer">
            <!-- <div class="signature-block-left">
                <div class="signature-line"></div>
                <div class="signer-name">Daniel Martinez</div>
                <div class="signer-title">Guild Master</div>
            </div> -->

            <div class="signature-block-right">
                <div class="signature-line"></div>
                <div class="signer-name">{{ $mentorName }}</div>
                <div class="signer-title">Mentor</div>
            </div>
        </div>

    </div>
</body>

</html>
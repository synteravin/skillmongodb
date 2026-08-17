<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Tugas Baru Menunggu Penilaian - {{ $studentName }}</title>
    <style type="text/css">
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            .email-body-content {
                padding: 24px 20px !important;
            }
            .button-cta {
                width: 100% !important;
                text-align: center !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: none; color: #334155;">

@php
    $coverSrc = url('images/email-cover.png');
    if (isset($message) && method_exists($message, 'embed') && file_exists(public_path('images/email-cover.png'))) {
        $coverSrc = $message->embed(public_path('images/email-cover.png'));
    }
@endphp

<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f1f5f9; padding: 32px 0;">
    <tr>
        <td align="center">
            <!-- MAIN CARD -->
            <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
                
                <!-- HEADER COVER BANNER -->
                <tr>
                    <td style="padding: 0; background-color: #f8fafc; text-align: center; line-height: 0;">
                        <img src="{{ $coverSrc }}" alt="SkillVentura" width="580" style="display: block; width: 100%; max-width: 580px; height: auto; border: 0; outline: none;" />
                    </td>
                </tr>

                <!-- MAIN BODY -->
                <tr>
                    <td class="email-body-content" style="padding: 36px 32px 28px 32px; background-color: #ffffff;">
                        
                        <!-- NOTIFICATION PILL BADGE -->
                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
                            <tr>
                                <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 6px 14px;">
                                    <span style="font-size: 12px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px; text-transform: uppercase;">
                                        🔔 Tugas Baru Menunggu Review
                                    </span>
                                </td>
                            </tr>
                        </table>

                        <!-- GREETING -->
                        <h1 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 700; line-height: 1.3;">
                            Halo {{ $notifiable->name ?? 'Mentor' }}, 👋
                        </h1>

                        <!-- INTRO TEXT -->
                        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                            Ada submission (tugas) baru yang dikumpulkan oleh siswa Anda dan membutuhkan pemeriksaan serta penilaian:
                        </p>

                        <!-- DETAIL BOX / CARD -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; border-collapse: separate;">
                            <!-- ROW: NAMA SISWA -->
                            <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td width="36" valign="top" style="font-size: 20px; line-height: 1;">👤</td>
                                            <td valign="top">
                                                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Nama Siswa</div>
                                                <div style="font-size: 16px; font-weight: 700; color: #0f172a;">{{ $studentName }}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- ROW: JUDUL TUGAS -->
                            <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td width="36" valign="top" style="font-size: 20px; line-height: 1;">📝</td>
                                            <td valign="top">
                                                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Judul Tugas</div>
                                                <div style="font-size: 16px; font-weight: 700; color: #2563eb;">{{ $submissionTitle }}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- ROW: CAREER GROUP -->
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td width="36" valign="top" style="font-size: 20px; line-height: 1;">🚀</td>
                                            <td valign="top">
                                                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Career Group</div>
                                                <div style="font-size: 16px; font-weight: 700; color: #0f172a;">{{ $careerGroupName }}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <!-- CTA BUTTON -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <!--[if mso]>
                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $actionUrl }}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="18%" stroke="f" fillcolor="#2563eb">
                                    <w:anchorlock/>
                                    <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Periksa Tugas Sekarang &rarr;</center>
                                    </v:roundrect>
                                    <![endif]-->
                                    <!--[if !mso]><!-- -->
                                    <a class="button-cta" href="{{ $actionUrl }}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #2563eb; letter-spacing: 0.3px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.25);">
                                        Periksa Tugas Sekarang &rarr;
                                    </a>
                                    <!--<![endif]-->
                                </td>
                            </tr>
                        </table>

                        <!-- NOTE CALLOUT -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 6px; margin-bottom: 24px;">
                            <tr>
                                <td style="padding: 12px 16px;">
                                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                                        <strong>Catatan:</strong> Harap segera diperiksa dan diberikan penilaian agar siswa dapat melanjutkan ke materi berikutnya. Terima kasih!
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <!-- SALUTATION -->
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                            Salam hangat,<br>
                            <strong style="color: #0f172a;">Tim SkillVentura</strong>
                        </p>

                    </td>
                </tr>

                <!-- SUBCOPY / FALLBACK LINK -->
                <tr>
                    <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                            Jika Anda mengalami kesulitan menekan tombol &ldquo;Periksa Tugas Sekarang&rdquo;, salin dan buka tautan berikut di web browser Anda:
                        </p>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5; word-break: break-all;">
                            <a href="{{ $actionUrl }}" target="_blank" style="color: #2563eb; text-decoration: underline;">
                                {{ $actionUrl }}
                            </a>
                        </p>
                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td style="padding: 24px 32px 28px 32px; background-color: #f1f5f9; text-align: center;">
                        <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                            &copy; {{ date('Y') }} <strong>SkillVentura</strong>. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                            Email ini dikirim otomatis oleh sistem notifikasi SkillVentura LMS.
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>

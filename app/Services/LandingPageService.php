<?php

namespace App\Services;

use App\Models\LandingPageSetting;

class LandingPageService
{
    /**
     * Get the clean, production-ready default landing page settings.
     *
     * @return array<string, mixed>
     */
    public function getDefaultSettings(): array
    {
        return [
            'about' => [
                'badge_title' => 'About Section',
                'card_1_title' => 'LMS & Jalur Belajar Modern',
                'card_1_text' => 'Skill Ventura merupakan platform Learning Management System (LMS) modern yang dirancang untuk membantu pengguna mengembangkan keterampilan melalui pengalaman belajar yang terstruktur, interaktif, dan mudah diakses. Platform ini menyediakan berbagai materi pembelajaran, jalur belajar (career path), simulasi praktik, serta pemantauan progres secara real-time sehingga pengguna dapat belajar sesuai kemampuan dan mencapai tujuan karier secara lebih efektif.',
                'card_2_title' => 'Gamifikasi & Sistem Level',
                'card_2_text' => 'Untuk meningkatkan motivasi dan konsistensi belajar, Skill Ventura menggabungkan konsep gamifikasi ke dalam setiap proses pembelajaran. Pengguna dapat memperoleh XP, membuka achievement, meningkatkan level, mengumpulkan badge, serta berkompetisi melalui leaderboard dan berbagai challenge. Pendekatan ini membuat proses belajar terasa lebih menarik, menyenangkan, dan mendorong pengguna untuk terus mengembangkan keterampilan hingga siap menghadapi kebutuhan dunia kerja.',
            ],
            'vision_mission' => [
                [
                    'id' => 'mission',
                    'badge' => 'Mission',
                    'title' => 'Mission',
                    'description' => 'Menyediakan ekosistem pembelajaran gamifikasi adaptif untuk mencetak talenta digital berdaya saing global.',
                    'icon' => '/images/roket.webp',
                    'badge_color' => '#F0E427',
                ],
                [
                    'id' => 'vision',
                    'badge' => 'Vision',
                    'title' => 'Vision',
                    'description' => 'Becoming the leading gamified learning ecosystem.',
                    'icon' => '/images/lamp.webp',
                    'badge_color' => '#68FF57',
                ],
                [
                    'id' => 'value',
                    'badge' => 'Value',
                    'title' => 'Value',
                    'description' => 'Innovation, accessibility, and community learning.',
                    'icon' => '/images/diamond.webp',
                    'badge_color' => '#3B28F6',
                ],
                [
                    'id' => 'goals',
                    'badge' => 'Goals',
                    'title' => 'Goals',
                    'description' => 'Empower learners with real-world tech skills.',
                    'icon' => '/images/target.webp',
                    'badge_color' => '#B91C1C',
                ],
            ],
            'faqs' => [
                [
                    'id' => 'faq-1',
                    'question' => 'Apa itu SKILL VENTURA dan bagaimana cara kerjanya?',
                    'answer' => 'SKILL VENTURA adalah platform Learning Management System (LMS) berbasis gamifikasi yang dirancang untuk membantu Anda menguasai keterampilan teknologi modern melalui materi terstruktur, simulasi praktik langsung, quest berbayar, dan sistem leveling interaktif.',
                    'is_active' => true,
                    'order' => 1,
                ],
                [
                    'id' => 'faq-2',
                    'question' => 'Apakah saya membutuhkan pengalaman sebelumnya untuk mulai belajar?',
                    'answer' => 'Tidak perlu. SKILL VENTURA menyediakan modul pembelajaran mulai dari tingkat pemula (beginner) hingga tingkat lanjut (advanced) dengan panduan langkah demi langkah yang ramah bagi pemula.',
                    'is_active' => true,
                    'order' => 2,
                ],
                [
                    'id' => 'faq-3',
                    'question' => 'Bagaimana cara kerja sistem gamifikasi di SKILL VENTURA?',
                    'answer' => 'Setiap kali Anda menyelesaikan materi, kuis, atau tugas, Anda akan memperoleh XP, menaikkan level karakter, membuka lencana pencapaian (achievements), serta dapat bersaing di leaderboard komunitas.',
                    'is_active' => true,
                    'order' => 3,
                ],
                [
                    'id' => 'faq-4',
                    'question' => 'Keahlian (skills) apa saja yang dapat saya pelajari?',
                    'answer' => 'Anda dapat mempelajari berbagai bidang teknologi yang diminati industri saat ini, seperti Web Development, Cyber Security, Cloud Computing, Data Science, Artificial Intelligence, Mobile Development, hingga UI/UX Design.',
                    'is_active' => true,
                    'order' => 4,
                ],
                [
                    'id' => 'faq-5',
                    'question' => 'Apakah tersedia roadmap atau jalur belajar yang terstruktur?',
                    'answer' => 'Ya, kami menyediakan fitur Skill Tree dan alur belajar karier yang jelas. Anda dapat memilih jalur keahlian yang diinginkan dan mengikuti rangkaian modul yang saling terhubung secara runtut.',
                    'is_active' => true,
                    'order' => 5,
                ],
                [
                    'id' => 'faq-6',
                    'question' => 'Bagaimana misi (quest) dan tantangan membantu mengasah kemampuan saya?',
                    'answer' => 'Quest disusun berdasarkan studi kasus nyata dari dunia kerja. Dengan menyelesaikannya, Anda tidak hanya memperkuat pemahaman teori, tetapi juga membangun portofolio proyek yang siap dipresentasikan kepada calon perekrut.',
                    'is_active' => true,
                    'order' => 6,
                ],
                [
                    'id' => 'faq-7',
                    'question' => 'Apakah saya mendapatkan XP atau reward setelah menyelesaikan tugas?',
                    'answer' => 'Tentu saja! Setiap penyelesaian quest dan tantangan akan memberikan reward berupa XP, badge eksklusif, peningkatan tier, serta reward kompensasi pada quest industri tertentu.',
                    'is_active' => true,
                    'order' => 7,
                ],
                [
                    'id' => 'faq-8',
                    'question' => 'Bisakah saya belajar dengan kecepatan dan waktu saya sendiri (self-paced)?',
                    'answer' => 'Ya, seluruh materi di SKILL VENTURA dapat diakses fleksibel 24/7. Anda bebas mengatur ritme dan waktu belajar sesuai dengan kesibukan dan kenyamanan Anda.',
                    'is_active' => true,
                    'order' => 8,
                ],
                [
                    'id' => 'faq-9',
                    'question' => 'Bagaimana jika saya mengalami kendala atau kesulitan saat belajar?',
                    'answer' => 'Anda dapat bertanya dan berdiskusi langsung dengan mentor serta sesama rekan pembelajar melalui fitur Forum Diskusi Komunitas, atau menghubungi tim support kami melalui menu kontak.',
                    'is_active' => true,
                    'order' => 9,
                ],
                [
                    'id' => 'faq-10',
                    'question' => 'Bagaimana cara mendaftar dan mulai belajar di SKILL VENTURA?',
                    'answer' => 'Cukup klik tombol "Start to learn" di halaman utama, buat akun Anda, pilih karakter dan skill tree yang ingin ditekuni, lalu mulailah petualangan belajar Anda!',
                    'is_active' => true,
                    'order' => 10,
                ],
            ],
            'community' => [
                'title' => "Join Us to Learn Level Up and\nMaster Real-World Tech",
                'button_text' => 'Join Community',
                'discord_url' => 'https://discord.gg/yourlink',
                'is_active' => true,
            ],
            'contact' => [
                'title' => 'Contact Us',
                'subtitle' => 'Kontak Kami',
                'description_1' => 'SKILL VENTURA contact support is available Monday to Friday, from 8 AM to 4 PM. During these hours, our team is ready to assist with questions, guidance, or any support you need while using the platform. Messages sent outside these hours will be answered on the next working day.',
                'description_2' => 'We remain committed to providing helpful and timely support to ensure your learning experience on SKILL VENTURA stays smooth and enjoyable.',
                'support_email' => 'support@skillventura.id',
                'working_hours' => 'Senin - Jumat: 08:00 - 16:00 WIB',
            ],
        ];
    }

    /**
     * Get the aggregated settings payload merging database values with defaults.
     *
     * @return array<string, mixed>
     */
    public function getSettingsPayload(): array
    {
        $defaults = $this->getDefaultSettings();
        /** @var LandingPageSetting|null $setting */
        $setting = LandingPageSetting::first();

        if (! $setting) {
            return $defaults;
        }

        return [
            'id' => (string) $setting->_id,
            'about' => array_merge($defaults['about'], (array) ($setting->about ?? [])),
            'vision_mission' => ! empty($setting->vision_mission) ? $setting->vision_mission : $defaults['vision_mission'],
            'faqs' => ! empty($setting->faqs) ? $setting->faqs : $defaults['faqs'],
            'community' => array_merge($defaults['community'], (array) ($setting->community ?? [])),
            'contact' => array_merge($defaults['contact'], (array) ($setting->contact ?? [])),
            'updated_at' => $setting->updated_at?->toISOString(),
        ];
    }

    /**
     * Get or create the single LandingPageSetting document.
     */
    public function getOrCreateSetting(): LandingPageSetting
    {
        /** @var LandingPageSetting|null $setting */
        $setting = LandingPageSetting::first();

        if (! $setting) {
            $setting = new LandingPageSetting;
        }

        return $setting;
    }

    /**
     * Update the About section data.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateAbout(array $data, ?string $userId = null): LandingPageSetting
    {
        $setting = $this->getOrCreateSetting();
        $defaults = $this->getDefaultSettings()['about'];

        $setting->about = array_merge($defaults, [
            'badge_title' => $data['badge_title'] ?? $defaults['badge_title'],
            'card_1_title' => $data['card_1_title'] ?? $defaults['card_1_title'],
            'card_1_text' => $data['card_1_text'] ?? $defaults['card_1_text'],
            'card_2_title' => $data['card_2_title'] ?? $defaults['card_2_title'],
            'card_2_text' => $data['card_2_text'] ?? $defaults['card_2_text'],
        ]);

        if ($userId) {
            $setting->updated_by = $userId;
        }

        $setting->save();

        return $setting;
    }

    /**
     * Update Vision & Mission pillars.
     *
     * @param  array<int, array<string, mixed>>  $pillars
     */
    public function updateVisionMission(array $pillars, ?string $userId = null): LandingPageSetting
    {
        $setting = $this->getOrCreateSetting();

        $cleanPillars = [];
        foreach ($pillars as $pillar) {
            $cleanPillars[] = [
                'id' => (string) ($pillar['id'] ?? uniqid('vm-')),
                'badge' => (string) ($pillar['badge'] ?? ''),
                'title' => (string) ($pillar['title'] ?? ''),
                'description' => (string) ($pillar['description'] ?? ''),
                'icon' => (string) ($pillar['icon'] ?? '/images/roket.webp'),
                'badge_color' => (string) ($pillar['badge_color'] ?? '#F0E427'),
            ];
        }

        $setting->vision_mission = $cleanPillars;

        if ($userId) {
            $setting->updated_by = $userId;
        }

        $setting->save();

        return $setting;
    }

    /**
     * Update FAQs list.
     *
     * @param  array<int, array<string, mixed>>  $faqs
     */
    public function updateFaqs(array $faqs, ?string $userId = null): LandingPageSetting
    {
        $setting = $this->getOrCreateSetting();

        $cleanFaqs = [];
        $order = 1;
        foreach ($faqs as $faq) {
            $cleanFaqs[] = [
                'id' => (string) ($faq['id'] ?? ('faq-' . uniqid())),
                'question' => trim((string) ($faq['question'] ?? '')),
                'answer' => trim((string) ($faq['answer'] ?? '')),
                'is_active' => (bool) ($faq['is_active'] ?? true),
                'order' => (int) ($faq['order'] ?? $order),
            ];
            $order++;
        }

        // Sort by order
        usort($cleanFaqs, fn (array $a, array $b): int => $a['order'] <=> $b['order']);

        $setting->faqs = $cleanFaqs;

        if ($userId) {
            $setting->updated_by = $userId;
        }

        $setting->save();

        return $setting;
    }

    /**
     * Update CTA / Community section.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateCommunity(array $data, ?string $userId = null): LandingPageSetting
    {
        $setting = $this->getOrCreateSetting();
        $defaults = $this->getDefaultSettings()['community'];

        $setting->community = array_merge($defaults, [
            'title' => $data['title'] ?? $defaults['title'],
            'button_text' => $data['button_text'] ?? $defaults['button_text'],
            'discord_url' => $data['discord_url'] ?? $defaults['discord_url'],
            'is_active' => isset($data['is_active']) ? (bool) $data['is_active'] : true,
        ]);

        if ($userId) {
            $setting->updated_by = $userId;
        }

        $setting->save();

        return $setting;
    }

    /**
     * Update Contact section.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateContact(array $data, ?string $userId = null): LandingPageSetting
    {
        $setting = $this->getOrCreateSetting();
        $defaults = $this->getDefaultSettings()['contact'];

        $setting->contact = array_merge($defaults, [
            'title' => $data['title'] ?? $defaults['title'],
            'subtitle' => $data['subtitle'] ?? $defaults['subtitle'],
            'description_1' => $data['description_1'] ?? $defaults['description_1'],
            'description_2' => $data['description_2'] ?? $defaults['description_2'],
            'support_email' => $data['support_email'] ?? $defaults['support_email'],
            'working_hours' => $data['working_hours'] ?? $defaults['working_hours'],
        ]);

        if ($userId) {
            $setting->updated_by = $userId;
        }

        $setting->save();

        return $setting;
    }
}

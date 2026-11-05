export interface LandingPageAbout {
    badge_title?: string;
    card_1_title?: string;
    card_1_text?: string;
    card_2_title?: string;
    card_2_text?: string;
}

export interface VisionMissionPillar {
    id: string;
    badge: string;
    title: string;
    description: string;
    icon: string;
    badge_color: string;
    [key: string]: any;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    is_active: boolean;
    order: number;
    [key: string]: any;
}

export interface LandingPageCommunity {
    title?: string;
    button_text?: string;
    discord_url?: string;
    is_active?: boolean;
}

export interface LandingPageContact {
    title?: string;
    subtitle?: string;
    description_1?: string;
    description_2?: string;
    support_email?: string;
    working_hours?: string;
}

export interface LandingPageSettingsPayload {
    id?: string;
    about: Required<LandingPageAbout>;
    vision_mission: VisionMissionPillar[];
    faqs: FaqItem[];
    community: Required<LandingPageCommunity>;
    contact: Required<LandingPageContact>;
    updated_at?: string;
}

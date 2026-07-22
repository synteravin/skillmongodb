export interface RevisionEntry {
    note: string;
    created_at: string;
    author_id: string;
    author_name: string;
}

export interface QuestRewards {
    exp?: number;
    gold?: number;
    rep?: number;
    erp?: number;
}

export interface Quest {
    _id: string;
    title: string;
    description: string;
    min_budget: number;
    max_budget: number;
    min_salary?: number;
    max_salary?: number;
    deadline: string;
    status: string;
    created_at?: string;
    creator_id: string;
    creator: {
        name: string;
        role?: string;
    };
    worker?: {
        name: string;
        email: string;
    } | null;
    worker_id?: string | null;
    submission_link?: string | null;
    submission_note?: string | null;
    submitted_at?: string | null;
    completed_at?: string | null;
    revision_note?: string | null;
    revisions?: Array<RevisionEntry>;
    rejection_note?: string | null;
    rating?: number | null;
    rating_comment?: string | null;
    images?: Array<{ name: string; url: string }>;
    files?: Array<{ name: string; url: string; size: number }>;
    submission_file?: { name: string; url: string; size: number } | null;
    tier?: string;
    custom_rewards?: { exp?: number; gold?: number; rep?: number } | null;
    dispute?: {
        status?: string;
        reason?: string;
        ruled_at?: string;
        ruling?: string;
        note?: string;
        split_percentage?: number;
        filer_id?: string;
        filer_name?: string;
    } | null;
    submission_history?: Array<{
        version: number;
        submitted_at: string;
        submission_link?: string | null;
        submission_note?: string | null;
        submission_file?: { name: string; url: string; size: number } | null;
    }>;
    rewards?: QuestRewards;
    accepted_bid_amount?: number | null;
    bids_count?: number;
    payment_proof?: { name: string; url: string; size: number } | null;
    payment_uploaded_at?: string | null;
    payment_confirmed_at?: string | null;
}

export interface Bid {
    _id: string;
    bid_amount: number;
    cv: string;
    portfolio: string;
    proposal: string;
    status: string;
    created_at: string;
    student: {
        _id: string;
        name: string;
        email: string;
    };
    unread_messages_count: number;
}

export interface HistoryQuest extends Quest {
    is_worker: boolean;
    is_creator: boolean;
    my_bid?: {
        bid_amount: number;
        status: string;
        proposal?: string;
        cv?: string;
        portfolio?: string;
    } | null;
}

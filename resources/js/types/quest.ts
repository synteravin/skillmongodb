export interface RevisionEntry {
    note: string;
    created_at: string;
    author_id: string;
    author_name: string;
}

export interface Quest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
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
    custom_rewards?: { exp?: number; gold?: number } | null;
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
    rewards?: {
        exp?: number;
        gold?: number;
        erp?: number;
    };
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

export interface HistoryQuest {
    _id: string;
    title: string;
    description: string;
    min_salary: number;
    max_salary: number;
    deadline: string;
    status: string;
    creator: {
        name: string;
        role: string;
    };
    worker_id?: string;
    is_worker: boolean;
    is_creator: boolean;
    worker?: {
        name: string;
        email: string;
    } | null;
    my_bid?: {
        bid_amount: number;
        status: string;
        proposal?: string;
        cv?: string;
        portfolio?: string;
    } | null;
    submission_link?: string;
    submission_note?: string;
    submission_file?: {
        name: string;
        size: number;
        url: string;
    } | null;
    submitted_at?: string;
    completed_at?: string;
    rating?: number;
    rating_comment?: string;
    revision_note?: string;
    rewards?: {
        exp?: number;
        gold?: number;
        erp?: number;
    };
    bids_count?: number;
    accepted_bid_amount?: number | null;
}

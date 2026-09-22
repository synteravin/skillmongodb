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

export interface QuestRound {
    round_number: number;
    status: 'submitted' | 'changes_requested' | 'approved' | string;
    submission: {
        submitted_at?: string | null;
        link?: string | null;
        note?: string | null;
        file?: { name: string; url?: string; path?: string; size: number } | null;
        changelog?: string | null;
    };
    review?: {
        reviewed_at?: string | null;
        reviewer_id?: string | null;
        reviewer_name?: string | null;
        status?: string | null;
        note?: string | null;
    } | null;
}

export interface ResolutionRequest {
    id: string;
    type: 'deadline_extension' | 'mutual_cancellation' | 'extension' | string;
    requester_id?: string;
    requester_name?: string;
    requested_by_name?: string;
    proposed_deadline?: string | null;
    reason: string;
    dp_handling?: 'refund_creator' | 'keep_worker' | 'split' | string | null;
    dp_settlement_percentage?: number | null;
    split_percentage?: number | null;
    status: 'pending' | 'accepted' | 'approved' | 'rejected' | string;
    created_at?: string;
    requested_at?: string;
    responded_at?: string | null;
    response_note?: string | null;
    responded_by_name?: string | null;
}

export interface QuestEvidenceRequest {
    id: string;
    target_party: 'creator' | 'worker' | 'both' | string;
    instruction: string;
    requested_at: string;
    deadline: string;
    deadline_hours: number;
    status: 'pending' | 'submitted' | string;
    submitted_at?: string;
    submitted_by?: string;
    notes?: string;
    files?: Array<{ name: string; url: string; size: number }>;
}

export interface QuestSanction {
    sanction_type: 'warning' | 'trust_penalty' | 'temporary_suspension' | 'permanent_ban' | string;
    sanction_target: 'creator' | 'worker' | 'both' | string;
    sanction_reason?: string;
    applied_at?: string;
}

export interface QuestP2pCompliance {
    status: 'verified' | 'non_compliant' | 'pending_verification' | 'pending_payment' | string;
    audit_note?: string;
    verified_at?: string;
    verified_by?: string;
    proof_uploaded_at?: string;
    proof_file?: { name: string; url: string; size: number };
    transfer_note?: string;
    uploaded_by?: string;
    bank_source?: string;
    bank_destination?: string;
    account_number_destination?: string;
    account_name_destination?: string;
    transaction_ref_no?: string;
    transferred_at?: string;
    amount?: number;
}

export interface QuestP2pLedger {
    contract_amount: number;
    dp_percentage: number;
    dp_amount: number;
    remaining_balance: number;
    disputed_amount: number;
    ruling_simulation?: {
        refund_creator: {
            paying_party: 'worker';
            receiving_party: 'creator';
            amount: number;
            description: string;
        };
        release_payout: {
            paying_party: 'creator';
            receiving_party: 'worker';
            amount: number;
            description: string;
        };
        split: {
            split_percentage: number;
            paying_party: 'creator' | 'worker' | 'none';
            receiving_party: 'creator' | 'worker' | 'none';
            amount: number;
            description: string;
        };
    };
}

export interface QuestArbitrationAward {
    award_number: string;
    ruled_at: string;
    arbiter_name: string;
    ruling_type: 'refund_creator' | 'release_payout' | 'split' | string;
    split_percentage?: number;
    findings_of_fact?: string;
    ratio_decidendi?: string;
    financial_order: {
        paying_party: 'creator' | 'worker' | 'none' | string;
        receiving_party: 'creator' | 'worker' | 'none' | string;
        amount: number;
        currency: string;
        payment_deadline: string;
        destination_bank_hint?: string;
    };
    platform_reward_order: {
        gold_creator: number;
        gold_worker: number;
        exp_worker: number;
    };
    sanction_order?: QuestSanction | null;
    legal_memorandum?: string;
}

export interface QuestDispute {
    status?: string;
    reason?: string;
    category?: string;
    category_label?: string;
    ruled_at?: string;
    ruling?: string;
    note?: string;
    ruling_note?: string;
    split_percentage?: number;
    filer_id?: string;
    filer_name?: string;
    memo_number?: string;
    verdict_label?: string;
    legal_disclaimer?: string;
    evidence_files?: Array<{ name: string; url: string }>;
    response?: {
        responder_id?: string;
        responder_name?: string;
        response_note?: string;
        responded_at?: string;
    } | null;
    evidence_requests?: Array<QuestEvidenceRequest>;
    sla_extended_hours?: number;
    sla_extension_reason?: string;
    sla_extended_at?: string;
    sanction?: QuestSanction | null;
    p2p_compliance?: QuestP2pCompliance | null;
    p2p_ledger?: QuestP2pLedger;
    award?: QuestArbitrationAward | null;
}

export interface Quest {
    _id: string;
    id?: string;
    slug?: string;
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
    rounds?: Array<QuestRound>;
    max_revisions?: number | null;
    rejection_note?: string | null;
    rating?: number | null;
    rating_comment?: string | null;
    images?: Array<{ name: string; url: string }>;
    files?: Array<{ name: string; url: string; size: number }>;
    submission_file?: { name: string; url: string; size: number } | null;
    tier?: string;
    custom_rewards?: { exp?: number; gold?: number; rep?: number } | null;
    dispute?: QuestDispute | null;
    resolution_requests?: Array<ResolutionRequest>;
    submission_history?: Array<{
        version: number;
        submitted_at: string;
        submission_link?: string | null;
        submission_note?: string | null;
        submission_file?: { name: string; url: string; size: number } | null;
        changelog?: string | null;
    }>;
    rewards?: QuestRewards;
    accepted_bid_amount?: number | null;
    bids_count?: number;
    dp_percentage?: number | null;
    dp_amount?: number | null;
    dp_proof?: { name: string; url: string; size: number } | null;
    dp_uploaded_at?: string | null;
    dp_confirmed_at?: string | null;
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

export interface DashboardDisputeItem {
    id: string;
    slug: string;
    title: string;
    contract_amount: number;
    dp_amount: number;
    creator: {
        id: string;
        name: string;
    };
    worker?: {
        id: string;
        name: string;
    } | null;
    phase: 'response_pending' | 'evidence_gathering' | 'ruling_pending' | 'compliance_pending';
    phase_label: string;
    urgent_action: string;
    sla_deadline?: string | null;
    sla_hours_remaining?: number | null;
    created_at: string;
}

export interface DashboardContractExposure {
    total_disputed_count: number;
    total_disputed_amount: number;
    total_active_quests: number;
    total_active_exposure: number;
    currency?: string;
}

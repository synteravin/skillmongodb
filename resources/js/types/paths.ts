export interface Path {
    id: string;
    slug?: string;
    name: string;
    description?: string;
    order: number;
}

export interface Group {
    id: string;
    slug?: string;
    name: string;
    description?: string;
    status?: 'draft' | 'published' | 'completed';
}

export interface CourseInfo {
    id: string;
    slug?: string;
    title: string;
    status: 'draft' | 'published';
}

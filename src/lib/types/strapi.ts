export interface StrapiResponse<T> {
    data: StrapiData<T>[] | null;
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiData<T> {
    id: number;
    attributes: T;
}

export interface StrapiMedia {
    data: {
        attributes: {
            url: string;
        };
    } | null;
}

export interface StrapiRelation<T> {
    data: Array<{
        id: number;
        attributes: T;
    }> | null;
}
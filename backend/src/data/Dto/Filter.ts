export interface Filter{
    page: string;
    limit: string;
    sort: string;
    order: string;
}

export interface Count{
    count: number;
}

export interface Arango{
    _key: string;
    _rev?: string;
    _id?: string;
}



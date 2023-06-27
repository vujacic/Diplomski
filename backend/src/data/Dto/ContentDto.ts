import {Arango, Filter} from "./Filter";

export class ContentDto implements Arango{
    _id: string;
    _key: string;
    _rev: string;
    title: string;
    body: string;
    userId: string;
    status: string;
    name: string;
    type: string;
    mimeType: string;
    date: Date;
    modified: Date;
    categories?: any[]
}

export class ContentFilter extends ContentDto implements Filter{
    limit: string;
    order: string;
    page: string;
    sort: string;

}

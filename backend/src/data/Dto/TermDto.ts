import {Arango, Filter} from "./Filter";
import {ContentDto} from "./ContentDto";

export class TermDto implements Arango{
    _id: string;
    _key: string;
    _rev: string;
    type: string;
    name: string;
    description: string;
    parentId: string;
}

//termEdge
//type: parent || link
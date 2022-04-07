import {Arango} from "./Filter";

export class OptionDto implements Arango{
    _id?: string;
    _key: string;
    _rev?: string;
    value: any;
}

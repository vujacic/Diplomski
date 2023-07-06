import {Filter} from "../Dto/Filter";
import {ContentFilter} from "../Dto/ContentDto";

export function getFilter(source: Filter){
    const page = Number.parseInt(source.page);
    const limit = Number.parseInt(source.limit);
    const offset = limit*page;
    return {
        page,
        limit,
        offset
    };
}

export function parseContentFilter(source: ContentFilter){
    if(!source.type){
        source.type = [];
    } else if(typeof source.type == "string"){
        source.type = [source.type]
    }

    if(!source.title){
        source.title = "";
    }
    if(!source.status){
        source.status = "";
    }
    if(!source.name){
        source.name = "";
    }
    source.partial = Boolean(source.partial);
}

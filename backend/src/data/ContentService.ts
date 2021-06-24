import {Db} from "./Db";
import {ContentDto, ContentFilter} from "./Dto/ContentDto";
import {aql} from "arangojs";
import {getFilter} from "./Helpers/FilterParser";

export class ContentService{
    content = Db.collection('content');
    constructor() {
    }

    async create(content: ContentDto){
            let res = this.content.save(content);
            return res;
    }

    async get(id: string){
            let res = await Db.query(aql`
                for c in ${this.content}
                filter c._key == ${id}
                return c
                `);
            return await res.next();
    }

    async update(id: string, content: ContentDto){
            let res = this.content.update(id, content);
            return res;

    }

    async getList(filter: ContentFilter) {
            let paging = getFilter(filter);
            let res = await Db.query(aql`
                for c in ${this.content}
                sort c.${filter.sort} ${filter.order}
                limit ${paging.page}, ${paging.limit}
                return c
                `);
            let cursor = await Db.query(aql`
                for c in ${this.content}
                collect with count into length
                return length
            `);
            let count1 = await cursor.next();
            return {"count": count1, "list": await res.all()};
    }

    async delete(id: string){
            let res = this.content.remove(id);
            return res;
    }
}

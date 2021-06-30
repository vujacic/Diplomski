import {Db} from "./Db";
import {ContentDto, ContentFilter} from "./Dto/ContentDto";
import {aql} from "arangojs";
import {getFilter, parseContentFilter} from "./Helpers/FilterParser";

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
            parseContentFilter(filter);
            // const filters: any = [];
            // if(filter.title) filters.push(aql`filter c.title like "%${filter.title}%"`);
            // if(filter.type) filters.push(aql `filter c.type like "%${filter.type}%"`);
            let paging = getFilter(filter);
            let res = await Db.query(aql`
                for c in ${this.content}
                filter
                (${filter.title} == "" or like(c.title, CONCAT('%',${filter.title},'%'), true))
                and (${filter.type} == "" or c.type == ${filter.type})
                and (${filter.status} == "" or c.status == ${filter.status})
                and (${filter.name} == "" or c.name == ${filter.name})
                sort c.${filter.sort} ${filter.order}
                limit ${paging.page}, ${paging.limit}
                return c
                `);
            let cursor = await Db.query(aql`
                for c in ${this.content}
                filter
                (${filter.title} == "" or like(c.title, CONCAT('%',${filter.title},'%'), true))
                and (${filter.type} == "" or c.type == ${filter.type})
                and (${filter.status} == "" or c.status == ${filter.status})
                and (${filter.name} == "" or c.name == ${filter.name})
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

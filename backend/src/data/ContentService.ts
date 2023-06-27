import {Db} from "./Db";
import {ContentDto, ContentFilter} from "./Dto/ContentDto";
import {aql} from "arangojs";
import {getFilter, parseContentFilter} from "./Helpers/FilterParser";
import {TermService} from "./TermService";

export class ContentService{
    content = Db.collection('content');
    termEdge = Db.collection('termEdge');
    termService = new TermService();

    constructor() {
    }

    async create(content: ContentDto){
        const categories = content.categories;
        delete content.categories;
        let res = await this.content.save(content);
        await this.addRemoveCategoryLinks(res._id, categories);
        return res;
    }

    async get(id: string){
        let res = await Db.query(aql`
            for c in ${this.content}
            filter c._key == ${id}
            return c
            `);

        let res1 = await res.next();
        res1.categories = await this.termService.GetAllByContentId(res1._id, "category");
        return res1;
    }

    async update(id: string, content: ContentDto){
        const categories = content.categories;
        delete content.categories;
        let res = await this.content.update(id, content);
        await this.addRemoveCategoryLinks(res._id, categories);
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

    async addRemoveCategoryLinks(contentId: string, categories?: any[]){
        const edges = (await this.termEdge.inEdges(contentId)).edges;
        await this.termEdge.removeAll(edges);
        let edgeArray: any = [];
        if(categories){
            for(let i = 0; i < categories.length; i++){
                edgeArray.push({
                    _from: categories[i]/*._id*/,
                    _to: contentId
                })
            }
            await this.termEdge.saveAll(edgeArray);
        }

    }
}

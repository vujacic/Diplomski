import {Db} from "./Db";
import {ContentDto, ContentFilter} from "./Dto/ContentDto";
import {aql} from "arangojs";
import {getFilter, parseContentFilter} from "./Helpers/FilterParser";
import {TermService} from "./TermService";

export class ContentService{
    content = Db.collection('content');
    termEdge = Db.collection('termEdge');
    contentView = Db.view('contentView');
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
                and (${filter.type} == [] or c.type in ${filter.type})
                and (${filter.status} == "" or c.status == ${filter.status})
                and (${filter.name} == "" or c.name == ${filter.name})
                sort c.${filter.sort} ${filter.order}
                limit ${paging.page}, ${paging.limit}
                return !${filter.partial} ? c :
                    {
                        _id: c._id,
                        _key: c._key,
                        _rev: c._rev, 
                        title: c.title,
                        body: left(c.body, 255),
                        userId: c.userId,
                        status: c.status,
                        name: c.name,
                        type: c.type,
                        date: c.date
                    }
                `);
            let cursor = await Db.query(aql`
                for c in ${this.content}
                filter
                (${filter.title} == "" or like(c.title, CONCAT('%',${filter.title},'%'), true))
                and (${filter.type} == [] or c.type in ${filter.type})
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

    async getAllByCatType(filter){
        if(!filter.key.includes("term"))
            filter.key=`term/${filter.key}`
        let paging = getFilter(filter);
        let res = await Db.query(aql`
                for c in ${this.content}
                    let edges = (for te in ${this.termEdge}
                    filter c._id == te._to and te._from == ${filter.key}
                    return te._to)
                    filter c._id in edges
                sort c.${filter.sort} ${filter.order}
                limit ${paging.offset}, ${paging.limit}
                return !${filter.partial} ? c :
                    {
                        _id: c._id,
                        _key: c._key,
                        _rev: c._rev, 
                        title: c.title,
                        body: left(c.body, 255),
                        userId: c.userId,
                        status: c.status,
                        name: c.name,
                        type: c.type,
                        date: c.date
                    }
                `);
        let cursor = await Db.query(aql`
                for c in ${this.content}
                    let edges = (for te in ${this.termEdge}
                    filter c._id == te._to and te._from == ${filter.key}
                    return te._to)
                filter c._id in edges
                collect with count into length
                return length
            `);
        let count1 = await cursor.next();
        return {"count": count1, "list": await res.all()};
    }

    async getByViewSearch(filter){
        parseContentFilter(filter);
        let paging = getFilter(filter);

        let res = await Db.query(aql`
            for c in ${this.contentView} 
            search analyzer(c.body in tokens(${filter.title}, "pip"), "pip")
            || analyzer(c.title in tokens(${filter.title}, "pip"), "pip")
            FILTER c.type in ['post', 'page']
            sort tfidf(c) desc
            limit ${paging.page}, ${paging.limit}
            return
            {
                _id: c._id,
                _key: c._key,
                title: c.title,
                body: left(c.body, 255),
                name: c.name,
                date: c.date
            }
        `);

        let cursor = await Db.query(aql`
             for c in ${this.contentView} 
            search analyzer(c.body in tokens(${filter.title}, "pip"), "pip")
            || analyzer(c.title in tokens(${filter.title}, "pip"), "pip")
            FILTER c.type in ['post', 'page']
            sort tfidf(c) desc
            collect with count into length
            return length
        `);
        let count1 = await cursor.next();
        return {"count": count1, "list": await res.all()};

    }
}

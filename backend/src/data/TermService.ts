import {Db} from "./Db";
import {aql} from "arangojs";
import {ContentDto} from "./Dto/ContentDto";
import {TermDto} from "./Dto/TermDto";
import {DocumentSelector} from "arangojs/documents";

export class TermService{
    term = Db.collection('term');
    termEdge = Db.collection('termEdge');
    // content = Db.collection('content');
    constructor() {
    }

    async get(key: string){
        let res = await Db.query(aql`
                for t in ${this.term}
                filter t._key == ${key}
                return t
                `);
        return await res.next();
    }

    async getByParentKey(key: string){
        let res = await Db.query(aql`
                for t in ${this.term}
                filter t.parentId == ${key}
                return t
                `);
        return await res.all();
    }

    async create(term: TermDto/*, parentKey?: string*/){
        let res = await this.term.save(term);
        // await this.updateTermEdges(term._key, parentKey);
        return res;
    }

    async update(key: string, term: TermDto/*, parentKey?: string*/){
        // await this.updateTermEdges(term._key, parentKey)
        let res = this.term.update(key, term);
        return res;
    }

    async delete(id: string){
        let key = id;
        if(!id.includes('term'))
            key = `term/${id}`;
        let toDelete = await this.get(id);
        let children = await this.getByParentKey(key);
        for(let i=0; i<children.length; i++){
            children[i].parentId = toDelete.parentId;
            await this.update(children[i]._key, children[i]);
        }
        let res = await this.term.remove(key);
        let allEdges = await this.termEdge.edges(key);
        await this.termEdge.removeAll(allEdges.edges);
        return res._key;
    }

    async getAllByType(filter: any){
        let res = await Db.query(aql`
            for t in ${this.term}
            filter t.type == ${filter.type}
            sort t.parentId, t.name
            return t
        `);
        return res.all();
    }

    async GetAllByContentId(contentId: string, type: string){
        let res = await Db.query(aql`
                for t in ${this.term}
                filter
                (${type} == "" or t.type == ${type})
                    let termIds = (for te in ${this.termEdge}
                    filter te._from == t._id && te._to == ${contentId}
                    return te._from)
                filter t._id in termIds
                return t
                `);
        return await res.all();
    }
}
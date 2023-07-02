import {Db} from "./Db";
import {aql} from "arangojs";
import {OptionDto} from "./Dto/OptionDto";

export class OptionsService {
    option = Db.collection('options');
    constructor() {
    }

    async create(option: OptionDto){
        if(!option._key)
            throw "Option name not found";
        let res = this.option.save(option);
        return res;
    }

    async get(name: string){
        let res = await Db.query(aql`
                for o in ${this.option}
                filter o._key == ${name}
                return o
                `);
        return await res.next();
    }

    async update(option: OptionDto){
        if(!option._key)
            throw "Option name not found";
        let res = this.option.update(option._key, option);
        return res;
    }

    async updateAll(options: OptionDto[]){
        let res = this.option.updateAll(options)
        return res;
    }

    async getAll(){
        let res = await Db.query(aql`
                for c in ${this.option}
                filter c.show == true
                return c
                `);
        return await res.all();
    }

    async delete(name: string){
        let res = this.option.remove(name);
        return res;
    }

    async deleteAll(){
        let res = await Db.query(aql`
            for o in ${this.option}
            remove o in ${this.option}
            return OLD._key
        `)
        return res;
    }
}

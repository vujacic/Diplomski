import {Db} from "./Db";
import {UserDto, UserFilter} from "./Dto/UserDto";
import {aql} from "arangojs";
import users from "../controllers/users";

export class UserService{
    users = Db.collection('users');
    constructor() {
    }

    async create(user: UserDto){
        try {
            let res = this.users.save(user);
            return res;
        }
        catch (e){
            return e;
        }
    }

    async get(id: string){
        try {
            let res = await Db.query(aql`
                for u in ${this.users}
                filter u._key == ${id}
                return u
                `);
            return res.all();
        }
        catch (e){
            return e;
        }
    }

    async update(user: UserDto){
        try {
            let res = this.users.update(user._id, user);
            return res;
        }
        catch (e){
            return e;
        }
    }

    async getList(filter: UserFilter){
        try {
            let limit = Number.parseInt(filter.limit);
            let page = Number.parseInt(filter.page)
            let offset = limit*page;
            let res = await Db.query(aql`
                for u in ${this.users}
                sort ${filter.sort} ${filter.order}
                limit ${offset}, ${limit}
                return u
                `);
            let cursor = await Db.query(aql`
                for u in ${this.users}
                collect with count into length
                return length
            `);
            let count1 = await cursor.next();
            return {"count": count1, "list": await res.all()};
        }
        catch (e){
            return e;
        }
    }
}

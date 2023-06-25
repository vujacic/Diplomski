import {Db} from "./Db";
import {UserDto, UserFilter} from "./Dto/UserDto";
import {aql} from "arangojs";
import {getFilter} from "./Helpers/FilterParser";

export class UserService{
    users = Db.collection('user');
    userRoles = Db.collection('userRole');
    roles = Db.collection('role');
    constructor() {
    }

    async create(user: UserDto){
            let res = this.users.save(user);
            return res;

    }

    async get(id: string){
            let res = await Db.query(aql`
                for u in ${this.users}
                filter u._key == ${id}
                return u
                `);
            return res.next();
    }

    async getByEmail(email: string){
        let res = await Db.query(aql`
                for u in ${this.users}
                filter u.email == ${email}
                return u
                `);
        return res.next();
    }

    async update(id: string, user: UserDto){
            let res = this.users.update(id, user);
            return res;

    }

    async getList(filter: UserFilter){
            let paging = getFilter(filter);
            let res = await Db.query(aql`
                for u in ${this.users}
                sort u.${filter.sort} ${filter.order}
                limit ${paging.offset}, ${paging.limit}
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

    async saveRole(userId: string, roleId: string) {

        let roleEdges = await this.userRoles.outEdges(userId);

        await this.userRoles.removeAll(roleEdges.edges.map(x => x._key));

        await this.userRoles.save({
            _from: userId,
            _to: roleId
        })
    }

    async getRoleByUserId(userId: string){
        return (await this.userRoles.outEdges(userId)).edges.map(x => x._to.split('/')[1]);
    }
}

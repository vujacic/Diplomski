import {Count, Filter} from "./Filter";

export class UserDto{
    _key: string;
    _rev: string;
    _id: string;
    name: string;
    email: string;
    pass: string;
    status: number;

    constructor(key: string, rev: string, id: string, name: string, email: string, pass: string, status: number) {
        this._key = key;
        this._rev = rev;
        this._id = id;
        this.name = name;
        this.email = email;
        this.pass = pass;
        this.status = status;
    }

}

export class UserFilter extends UserDto implements Filter {
    limit: string;
    page: string;
    order: string;
    sort: string;


    constructor(key: string, rev: string, id: string, name: string, email: string, pass: string, status: number, limit: string, page: string, asc: string, sort: string) {
        super(key, rev, id, name, email, pass, status);
        this.limit = limit;
        this.page = page;
        this.order = asc;
        this.sort = sort;
    }
}


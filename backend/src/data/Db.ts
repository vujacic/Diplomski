import {Database} from "arangojs";


import * as dbconfig from "../dbconfig.json";
//import * as fs from "fs";

//const dbconfig = JSON.parse(fs.readFileSync('./dbconfig.json').toString());

// export class Db {
export const Db: Database = new Database({
    url: dbconfig.host,
    databaseName: dbconfig.name,
    auth: {username: dbconfig.user, password: dbconfig.password}
});

//     constructor() {
//
//     }
//
// }

// const db = new Database({
//     url: dbconfig.host,
//     databaseName: dbconfig.name,
//     auth: {username: dbconfig.user, password: dbconfig.password}
// });


let dbconfig = require("../../dbconfig.json")
let Db = require("arangojs/database");
let schema = require("./userSchema.json");

const db  = new Db.Database({
    url: dbconfig.host,
    databaseName: dbconfig.name,
    auth: {username: dbconfig.user, password: dbconfig.password},
});

const col = db.collection("users");

col.properties({"schema": schema})
    .then((val) =>{
        console.log(val);
    })

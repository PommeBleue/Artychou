class DataBaseService {
    constructor(client) {

        this.db = null;
        this.client = client;
    }

    init() {
        this.db = require("rethinkdbdash")().db("artychou");
        return this;
    }

    async getTableAsync(type) {
        let db = this.db;
        let table;
        try {
            table = db.table(type);
        } catch (e) {
            throw e;
            return;
        }
        return table;
    }

    async AddInTableAsync(type, object) {
        let db = this.db;
        try {
            db.table(type).insert(object).run();
        } catch (e)  {
            throw e;
            return;
        }
        return this;
    }

    async UpdateInTableAsync(type, object) {
        let db = this.db;
        try {
            db.table(type).get(object.id).update(object).run();
        } catch (e) {
            throw e;
            return;
        }
        return this;
    }

};

module.exports = DataBaseService;
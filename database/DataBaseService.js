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

};

module.exports = DataBaseService;
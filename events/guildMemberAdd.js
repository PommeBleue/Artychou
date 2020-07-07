const User = require("../structures/models/user/User");

module.exports = class {
    constructor(client) {
        this.client = client;
    }


    async run(member) {
        const { usermanager } = this.client;
        const { user } = member;
        const { id, username } = user;
        const u = new User(id, username);
        await usermanager.AddUserAsync(u);
        usermanager.AddUserLocal(u);
        return true;
    }
};
const User = require("../models/user/User");
const {Collection} = require('discord.js');

class UserManager {
    constructor(client) {

        this.type = "users";

        this.client = client;
        this.table = null;

        this.users = new Collection();
    }

    async init() {
        this.table = await this.client.dbService.getTableAsync(this.type);
        await this.loadUsersAsync();
        this.registerUsersFromCache();
        return this;
    }

    getUserById(id) {
        let user = this.users.get(id);
        if(!user) {
            throw new Error();
            return;
        }
        return user;
    }

    async loadUsersAsync() {
        let table = this.table;
        for(let i=0; i < table.length; i++) {
            let u = table[i];
            let user = new User(u.id, u.username ? u.username : "undefined")
                .setBalance(u.bal ? u.bal : -1)
                .setDaily(u.daily ? u.daily : -1)
                .setCommandCount(u.ccount ? u.daily : -1)
                .setExperience(u.experience ? u.experience : -1)
                .setBotOwner(u.botOwner ? u.botOwner : false);
            this.users.set(user.id, user);
        }
    }

    UpdateUserLocal(id, user) {
        try {
            this.users.set(id, user);
            return this;
        } catch (e) {
            throw e;
            return false;
        }
    }

    AddUserLocal(user) {
        this.users.set(user.id, user)
    }

    async UpdateUserAsync(user) {
        let response;
        try {
            response = await this.client.dbService.UpdateInTableAsync(this.type, user);
        } catch (e) {
            throw e;
        }
        if(response) return this;
        return false;
    }

    async AddUserAsync(user) {
        let response;
        try {
            response = await this.client.dbService.AddInTableAsync(this.type, user);
        } catch (e) {
            throw e;
        }
        if(response) return this;
        return false;
    }

    registerUsersFromCache(){
        const cache = this.client.users.cache;
        cache.forEach((user, id) =>  {
            const u = new User(user.username, id);
            if (!this.exists(id)) {
                if(!user.bot) {
                    (async () => {
                        try {
                            await this.AddUserAsync(u);
                        } catch (e) {
                            this.client.logger.error(`Failed to add [${id}] to database.`);
                        }
                    })();
                    this.AddUserLocal(u);
                } else {
                    this.client.logger.warn('Cannot add bot User to database.');
                }
            }
        });
    }

    exists(id) {
        return this.users.has(id);
    }
}

module.exports = UserManager;

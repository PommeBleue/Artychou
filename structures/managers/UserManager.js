const User = require("../models/user/User");
const util = require("../../utils/models/Users");
const {Collection} = require('discord.js');

class UserManager {
    constructor(client) {

        this.type = "users";

        this.client = client;
        this.table = null;

        this.teams = client.teamanger;
        this.users = new Collection();
    }

    async init() {
        this.table = await this.client.dbService.getTableAsync(this.type);
        await this.loadUsersAsync();
        this.registerUsersFromCache();
        this.UpdateUsersAsync();
        console.log(this.users);
        return this;
    }

    getUserById(id) {
        let user = this.users.get(id);
        if(!user) throw new Error('User not found');
        return user;
    }

    async loadUsersAsync() {
        let table = this.table;
        for(let i=0; i < table.length; i++) {
            let u = table[i];
            let update = false;
            for(let i = 0; i < util.KEYS.length; i++) if(u[util.KEYS[i]] === undefined) update = true;
            let user = new User(u.id, u.username)
                .setBalance(u.bal >= 0 ? u.bal : 0)
                .setDaily(u.daily>=0 ? u.daily : 0)
                .setCommandCount(u.ccount >= 0 ? u.ccount : 0)
                .setExperience(u.experience >= 0 ? u.experience : 0)
                .setBotOwner(u.botOwner ? u.botOwner : false)
                .setRegisteredAt(u.registeredAt ? u.registeredAt : Date.now())
                .setTeam(u.team ? u.team : null);
            this.users.set(user.id, user);
            if(update) {
                await this.UpdateUserAsync(user);
                this.client.logger.warn(`Updated not valid data for ${user.username} [id : ${user.id}]`);
            }
            this.client.logger.log(`loaded id : ${user.id} username: ${user.username}`);
        }
    }

    UpdateUserLocal(id, user) {
        try {
            this.users.set(id, user);
            return this;
        } catch (e) {
            throw e;
        }
    }

     async UpdateUsersAsync() {
        for (const v of this.users) {
            await this.UpdateUserAsync(v[1]);
        }
        return this;
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
            const u = new User(id, user.username);
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

const GameStats = require("../models/games/GameStats");
const { Collection } = require("discord.js");

class GameManager {
    constructor(client) {
        this.client = client;
        this.type = "games";

        this.games = new Collection();
    }

    async init() {
        const { client } = this;
        this.table = await client.dbService.getTableAsync(this.type);
        this.loadGameStatistics();
        return this.loadFromCache();
    }

    getById(id) {
        if(!this.games.has(id)) {
            const game = new GameStats();
            this.games.set(id, game);
        }
        return this.games.get(id);
    }

    loadGameStatistics() {
        const { table } = this;
        for(let i in table) {
            const { games, id } = table[i];
            const stats = new GameStats();
            const keys = Object.keys(games);
            for (let j in keys) {
                const key = keys[j];
                if (key === "id") continue;
                stats.updateGame(key, games[key]);
            }
            this.games.set(id, stats);
            console.log('pouet')
        }
        return this;
    }

    async loadFromCache() {
        const { client } = this;
        const keys = client.users.cache.keyArray();
        for(let i in keys) {
            const id = keys[i];
            if(this.games.has(id)) continue;
            const game = new GameStats();
            this.games.set(game);
            await this.AddGameStatistics(id, game);
        }
        return this;
    }

    async updateGameStatistics(id, games) {
        let response;
        try {
            response = await this.client.dbService.UpdateInTableAsync(this.type, {id, games});
        } catch (e) {
            throw e;
        }
        if(response) {
            this.games.set(id, games);
            return this;
        }
        return false;
    }


    async AddGameStatistics(id, games) {
        let response;
        try {
            response = await this.client.dbService.AddInTableAsync(this.type, {id, games});
        } catch (e) {
            throw e;
        }
        if(response) {
            this.games.set(id, games);
            return this;
        }
        return false;
    }

}

module.exports = GameManager;
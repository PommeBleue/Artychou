const Enmap = require('enmap');
const DataGuildManager = require('../managers/DataGuildManager');

module.exports = class SettingsHandler {
    constructor(client) {
        this.type = "guilds";
        this.client = client;
        this.manager = new DataGuildManager(this);
        this.settings = new Enmap({name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }


    init() {
        //this.table = await this.client.dbService.getTableAsync(this.type);
        const defaultsData = this.manager.getDefaults();
        console.log(defaultsData);
        const defaults = defaultsData.getData();
        this.settings.set("defaults", defaults);
        return this;
    }

    async exitSaveAsync() {
        const settings = this.settings;
        const keyArray = settings.keyArray();
        for (let i = 0, len = keyArray.length; i < len; i++) {
            const key = keyArray[i];
            let guildData = this.manager.createGuildData(key, settings.get(key));
            if (this.table[key]) {
                await this.UpdateGuildDataAsync(guildData);
                continue;
            }
            await this.pushGuildDataToDataBaseAsync(guildData);
        }
    }

    async UpdateGuildDataAsync(guildData) {
        let response;
        try {
            response = await this.client.dbService.UpdateInTableAsync(this.type, guildData);
        } catch (e) {
            throw e;
        }
        if (response) return this;
        return false;
    }

    async pushGuildDataToDataBaseAsync(guildData) {
        let db = this.client.dbService;
        let response;
        try {
            response = await db.AddInTableAsync(this.type, guildData);
        } catch (e) {
            throw e;
        }
        if (response) return this;
        return false;
    }

    getSettings(guild) {
        const defaults = this.settings.get("defaults") || {};
        const guildData = guild ? this.settings.get(guild.id) || {} : {};
        return this.completeSettings(defaults, guildData);
    }

    completeSettings(defaults, object) {
        const result = {};
        for(const key in defaults) {
            const current = defaults[key];
            if(typeof current === 'object') {
                result[key] = object[key] ? (this.completeSettings(defaults[key], object[key])) : defaults[key];
                continue;
            }
            result[key] = object !== undefined ? (object[key] ? object[key] : defaults[key]) : defaults[key];
        }
        return result;
    }

    checkSettings(defaults, object, newSettings) {
        for (const key in newSettings) {
            if (!defaults[key]) continue;
            if (defaults[key] !== newSettings[key]) {
                if (typeof newSettings[key] === 'object') {
                    object[key] = object[key] ? this.checkSettings(defaults[key], object[key], newSettings[key]) : this.checkSettings(defaults[key], defaults[key], newSettings[key]);
                    continue;
                }
                object[key] = newSettings[key];
            } else {
                delete object[key];
            }
        }
        return object;
    }

    setSettings(id, newSettings) {
        const defaults = this.settings.get("defaults");
        let settings = this.settings.get(id);
        if (typeof settings != "object") settings = {};
        settings = this.checkSettings(defaults, settings, newSettings);
        console.log(settings);
        this.settings.set(id, settings);
    }
};
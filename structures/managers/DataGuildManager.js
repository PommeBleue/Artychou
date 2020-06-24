const GuildData = require('../models/data/GuildData');
const fse = require('fs-extra');


class DataGuildManager {
    constructor(handler) {
        this.path = '../models/json/JsonDefaultConfig.json';
        this.handler = handler;
    }

    init(){

    }

    async getDefaults(){
        const path = this.path;
        let obj = {};
        try{
            obj = await fse.readJson(path);
        } catch (e) {
            throw e;
        }
        if(obj === {}) throw new Error('No data in the object file');
        const guildData = this.createGuildData("0", obj);
        return guildData;
    }

    createGuildData(id, object){
        return new GuildData(id, object)
    }
}

module.exports = DataGuildManager;
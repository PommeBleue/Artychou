const GuildData = require('../models/data/GuildData');
const fse = require('fs-extra');


class DataGuildManager {
    constructor(handler) {
        this.path = '/Users/mac/WebstormProjects/artychou2/structures/models/json/JsonDefaultConfig.json';
        this.handler = handler;
    }

    init(){

    }

    getDefaults(){
        const path = this.path;
        let obj = {};
        try{
            obj = fse.readJsonSync(path);
            console.log(obj);
        } catch (e) {
            throw e;
        }
        if(obj === {}) throw new Error('No data in the object file');
        return this.createGuildData("0", obj);
    }

    createGuildData(id, object){
        return new GuildData(id, object)
    }
}

module.exports = DataGuildManager;
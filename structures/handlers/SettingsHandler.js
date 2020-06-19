const Enmap = require('enmap');

module.exports = class SettingsHandler {
    constructor() {
        this.settings = new Enmap({name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }

    getSettings(guild){
        const defaults = this.settings.get("defaults") || {};
        const guildData = guild ? this.settings.get(guild.id) || {} : {};
        const returnObject = {};
        Object.keys(defaults).forEach((key) => {
            returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
        });
        return returnObject;
    }

    setSettings(id, newSettings){
        const defaults = this.settings.get("defaults");
        let settings = this.settings.get(id);
        if(typeof settings != "object") settings = {};
        for(const key in newSettings) {
            if(defaults[key] !== newSettings[key]) {
                settings[key] = newSettings[key];
            } else {
                delete settings[key];
            }
        }
        this.settings.set(id, settings);
    }
}
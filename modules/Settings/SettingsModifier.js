const fse = require('fs-extra');

class SettingsModifier {
    constructor(client) {
        this.client = client;
        this.keysPath = "/Users/mac/WebstormProjects/artychou2/structures/models/json/ReadOnlySettings.json"
    }

    modify(path, guild, value) {
        let copied = [];
        const settings = this.client.settingsHandler.getSettings(guild);
        const newSetting = this.setSetting(path, settings, value, copied);
        if(!newSetting) return false;
        const newObjectSetting = this.newObject(newSetting.array, newSetting.value);
        console.log(newObjectSetting);
        this.client.settingsHandler.setSettings(guild.id, newObjectSetting);
        return newObjectSetting;
    }

    setSetting(path, object, value, array = null){
        if(!Array.isArray(path)) throw new TypeError('Path must be an array.');
        const element = path.shift();
        if(array) array.push(element);
        const current = object[element];
        if(current === undefined) {
            return false;
        } else if(typeof current !== 'object') {
            const safeValue = (current === 'true' || current === 'false') ? (current === 'true' ? true : false) : (/^\d+$/.test(current) ? Number(current) : current)
            if(typeof safeValue !== typeof value) return false;
            return { "key": element, "value": value, "array": array }
        }
        return this.setSetting(path, current, value, array);
    }

    getSettingsWithPath(path, object){
        const o = {};
        if(!Array.isArray(path)) throw new TypeError('Path must be an array.');
        const element = path.shift();
        const current = object[element];
        if(current === undefined) {
            return false;
        } else if(typeof current !== 'object') {
           return {name: element, value: current, type: typeof current};
        }
        if(path.length) return o[element] = this.getSettingsWithPath(path, current);
        return current;

    }

    getSettingsInObjectWithPath(path, guild){
        const settings = this.client.settingsHandler.getSettings(guild);
        return this.getSettingsWithPath(path, settings);
    }

    newObject(path, value){
        const object = {};
        const last = path[(path.length - 1) > 0 ? path.length - 1 : 0];
        const element = path.shift();
        console.log('element', element);
        if(element === last) {
            object[element] = value;
            return object;
        }
        object[element] = this.newObject(path, value);
        return object;
    }

    getReadOnlySettings(){
        const path = this.keysPath;
        let obj = undefined;
        try{
            obj = fse.readJsonSync(path);
        } catch (e) {
            throw e;
        }
        return obj;
    }
}

module.exports = SettingsModifier;

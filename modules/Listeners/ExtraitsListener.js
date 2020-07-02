const comparer = require("string-similarity");
const string = require("underscore.string");
const path = require("path");
const util = require("../../utils/UtilsJson");

class ExtraitsListener {
    constructor(client) {
        this.client = client;
        this.path = `${__dirname}/../../structures/models/json/extraits.json`;
    }

    async doAsync(message) {
        const activated = message.settings["extraits"]["activated"] === "true";
        if(!activated) return false;
        const path = this.path;
        const channel = message.channel;
        const content = string.clean(message.content);
        const chars = string.chars(content);
        const arrays = util.readJsonSync(path);
        const keys = util.getKeysInArray(arrays);
        let canDo = this.compareNormal(keys, chars);
        canDo = canDo ? canDo : this.compareAlias(arrays, chars);
        if (!canDo) return false;
        const replies = arrays[canDo]["array"];
        const response = this.getARandomReply(replies);
        if (response) return await channel.send(response);
    }

    compareNormal(keys, chars) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if(chars.length === key.length) {
                const p = comparer.compareTwoStrings(chars.join('').toLowerCase(), key.toLowerCase());
                if (p > 0.666) return key;
            }
            for (let j = 0; j < chars.length - key.length + 1; j++) {
                let current = j;
                const word = [];
                for (let k = 0; k < key.length; k++) {
                    word.push(chars[current]);
                    current++
                }
                const p = comparer.compareTwoStrings(word.join('').toLowerCase(), key.toLowerCase());
                if (p > 0.8) return key;
            }
        }
        return false;
    }

    compareAlias(object, chars) {
        for (const key in object) {
            const current = object[key];
            const alias = current["alias"];
            if (alias.length) {
                const canDo = this.compareNormal(alias, chars);
                if (canDo) return key;
            }
        }
        return false;
    }

    getARandomReply(array) {
        if(array.length) return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = ExtraitsListener;
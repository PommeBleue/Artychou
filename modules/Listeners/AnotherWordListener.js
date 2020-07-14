const s = require("underscore.string");

class AnotherWordListener {
    constructor(client) {
        this.client = client;
    }

    async doAsync(message) {
        const reformat = message.content === message.content.toUpperCase();
        const str = message.content.toLowerCase();
        const channel = message.channel;
        if(/[(x00-xF7)|(\:\()]+\./gm.test(str)) {
            const content = str.slice(0, str.length - 1).split(/\s/);
            const logical = content.every(e => e === content[0]);
            let first = null;
            let array = []; //NO DOUBT
            let firstArray = []; // NO DOUBT
            let oFirst = null; // NO
            for(let i=0; i<content.length; i++){
                let current = content[i]; // DOUBT
                if(oFirst === null) {
                    oFirst = current;
                    array.push(current);
                    continue;
                }
                if(current === oFirst) {
                    firstArray.push(array.join(' '));
                    array = [];
                    array.push(current);
                    continue;
                }
                array.push(current);
                if(i === content.length -1) firstArray.push(array.join(' '));
            }
            if(logical && content.length > 1) {
                first = content[0];
                if (content.every(element => element === first)) await channel.send(reformat ? `${(content.join(' '))} ${first}.`.toUpperCase() : s.capitalize(`${(content.join(' '))} ${first}.`, true));
                return;
            }
            first = firstArray[0];
            if(firstArray.length > 1) {
                if (firstArray.every(element => element === first)) await channel.send(reformat ? `${(content.join(' '))} ${first}.`.toUpperCase() : s.capitalize(`${(content.join(' '))} ${first}.`, true));
            }
        }
    }

}


module.exports = AnotherWordListener;
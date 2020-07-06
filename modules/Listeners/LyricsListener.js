const stringSimilarity = require('string-similarity');
const {Collection} = require("discord.js");

class LyricsListener {
    constructor(client) {
        this.client = client;
        this.collection = new Collection();
    }

    init() {
        return this;
    }

    async doAsync(message){
        if(message.attachments.size) return;
        const str = message.content;
        const guild = message.guild;
        const songs = message.songs;
        const currentSongs = songs[`songsarray_${guild.id}`];
        const userId = message.author.id;
        const songsArray = currentSongs.getArray(userId);
        if(songsArray === undefined) return;
        for(let i=0,len = songsArray.length; i<len; i++){
            const song = songsArray[i];
            const name = song.getFullTitle ? song.getFullTitle() : song["song"]["full_title"];
            const lyrics = song.getLyricsInArray().filter(e => e !== '');
            let result = null;
            let bool = false;
            for(let j=0; j < lyrics.length; j++){
                const line = lyrics[j];
                const p = stringSimilarity.compareTwoStrings(line.toLowerCase(), str.toLowerCase());
                if(p > 0.7) {
                    const k = j + 1;
                    result = this.memory(name, k, lyrics.length - 1);
                    console.log('result', result);
                    if (result.length && result.some(e => e.output === k || e.output === j)) {
                        this.collection.get(name).pop();
                        continue;
                    }
                    result = lyrics[j + 1];
                    bool = true;
                    break;
                }
            }
            if(bool) {
                return await message.channel.send(result);
            }
        }
    }

    memory(name, i, f) {
        if(i === f) {
            this.collection.set(name, []);
            return [];
        }
        const array = this.collection.has(name) ? this.collection.get(name) : [];
        array.push({input: i - 1, output: i});
        this.collection.set(name, array);
        return array.slice(0, array.length - 1);
    }

}

module.exports = LyricsListener;
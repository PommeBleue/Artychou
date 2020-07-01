const stringSimilarity = require('string-similarity');

class LyricsListener {
    constructor(client) {
        this.client = client;
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
            const lyrics = song.getLyricsInArray();
            let result = null;
            const bool = lyrics.some(e => {
                const p = stringSimilarity.compareTwoStrings(e.toLowerCase(), str.toLowerCase());
                if(p > 0.5) {
                    result = lyrics[lyrics.indexOf(e) + 1] ? lyrics[lyrics.indexOf(e) + 1] : lyrics[0];
                    return true;
                }
            });
            if(bool) {
                return await message.channel.send(result);
            }
        }
    }

}

module.exports = LyricsListener;
const stringSimilarity = require('string-similarity');

class LyricsListener {
    constructor(message) {
        this.message = message;
    }

    init() {
        return this;
    }

    async doAsync(){
        const message = this.message;
        const guild = message.guild;
        const songs = message.songs;
        const currentSongs = songs[`songsarray_${guild.id}`];
        const userId = message.author.id;
        const songsArray = currentSongs.getArray(userId);

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
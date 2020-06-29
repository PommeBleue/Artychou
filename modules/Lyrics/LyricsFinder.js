const solenolyrics = require('solenolyrics');
const Song = require('../../structures/models/song/Song');
class LyricsFinder {
    constructor(client) {
        this.client = client;
    }

    async getSong(name){
        const title = await this.getTitle(name);
        const author = await this.getAuthor(name);
        const lyrics = await this.getLyrics(name);
        return new Song({lyrics, title, author});
    }

    getTitle(name){
        return solenolyrics.requestTitleFor(name);
    }

    getLyrics(name){
        return solenolyrics.requestLyricsFor(name);
    }

    getAuthor(name){
        return solenolyrics.requestAuthorFor(name);
    }

    getIcon(name){
        return solenolyrics.requestIconFor(name);
    }




}

module.exports = LyricsFinder;
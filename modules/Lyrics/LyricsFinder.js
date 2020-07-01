const ArtychouLyrics = require('../../utils/fetch/ArtychouLyrics');
const Song = require('../../structures/models/song/Song');
class LyricsFinder {
    constructor(client) {
        this.finder = new ArtychouLyrics(client);
        this.client = client;
    }
    
    async getSong(name){
        return await this.finder.query(name);
    }

}

module.exports = LyricsFinder;
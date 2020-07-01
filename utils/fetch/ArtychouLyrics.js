const got = require('got');
const GeniusSong = require('../../structures/models/song/Song');
const cheerio = require('cheerio');

class ArtychouLyrics {
    constructor(client) {
        this.token = client.config.apis.genius.token;
        this.api = client.config.apis.genius.apiUrl;
    }

    async query(name){
        try {
            const api = this.api;
            const url = `${api}${encodeURI(name)}`;
            const id = await this.getId(url);
            const song = await this.getSong(id);
            const lyrics = await this.getLyricsFromHtml(song);
            return new GeniusSong(song, lyrics);
        } catch (e) {
            return false;
        }
    }

    async getId(url) {
        const token = this.token;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await got(url, {headers: headers});
        const obj = JSON.parse(response.body);
        return obj.response.hits[0].result.id;
    }

    async getSong(id) {
        const url = `https://api.genius.com/songs/${id}`;
        const token = this.token;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await got(url, {headers: headers});
        const obj = JSON.parse(response.body);
        return obj.response.song;
    }

    async getLyricsFromHtml(song) {
        const url = song.url;
        const result = await got(url);
        const text = result.body;
        const $ = cheerio.load(text);
        return $('.lyrics')
                .text()
                .trim();
    }

}

module.exports = ArtychouLyrics;
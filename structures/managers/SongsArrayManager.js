const {Collection} = require('discord.js');
const Song = require("../models/song/Song");


class SongsArrayManager {
    constructor(client, guild) {
        this.type = "songs";
        this.guild = guild;
        this.client = client;
        this.dbSongs = new Collection();
        this.songs = new Collection();
    }

    async init() {
        const type = this.type;
        const table = await this.client.dbService.getTableAsync(type);
        this.table = table;
        if(Object.keys(table)){
            for(const key in table) {
                const song = table[key];
                const newSong = new Song(song["song"], song["lyrics"]);
                const id = song["song"]["title"];
                const lyrics = song["lyrics"];
                if(lyrics && lyrics.length === 1) continue;
                this.dbSongs.set(id, newSong);
            }
        }
        //console.log(this.dbSongs);
        return this;
    }

    async setSongsInArray(userId, songsArray){
        const client = this.client;
        const finder = client.packages["LyricsFinder"];
        const array = [];
        for(let i=0, len=songsArray.length; i<len; i++){

            const name = songsArray[i];
            //console.log('name', name);
            let song = {};
            if(this.dbSongs.has(name)) {
                //console.log('from db', name);
                song = this.dbSongs.get(name);
                array.push(song);
                continue;
            }
            try {
                song = await finder.getSong(name);
            } catch (e) {
                return false;
            }
            if(song) {
                if(song.getLyricsInArray().length === 1) {
                    //console.log('no lyrics', name);
                    array.push({getFullTitle: () => `~~${song["full_title"]}~~`, getLyricsInArray: () => ['']});
                    continue;
                }
                array.push(song);
                await this.client.dbService.AddInTableAsync(this.type, song);
            }
        }
        if(array.length !== 0){
            const safeId = (userId.match(/\d+/) || [])[0];
            this.songs.set(safeId, array);
            return this;
        }
        return false;
    }

    async setSongInArray(userId, name){
        const client = this.client;
        const finder = client.packages["LyricsFinder"];
        const array = this.getArray(userId) ? this.getArray(userId) : [] ;
        //console.log(array);
        let song = {};
        try {
            song = await finder.getSong(name);
        } catch (e) {
            return 'error';
        }
        if(song) {
            if(array.length && array.some(e => {
                return e.getTitle() === song.getTitle();
            })) return false;
            if(song.getLyricsInArray().length === 1) return false;
            array.push(song);
            this.songs.set(userId, array);
            await this.client.dbService.AddInTableAsync(this.type, song);
            return song;
        }
        return 'error';
    }

    removeSongFromArray(id, name){
        const array = this.getArray(id);
        const newArray = array.filter(x => x.getTitle() !== name);
        this.setArray(id, newArray);
        const bool = this.client.songGuildManger.removeSongFromArray(this.guild, id, name);
        if(!bool) return false;
        return this;

    }

    setArray(userId, array){
        this.songs.set(userId, array);
        return this;
    }

    getArray(userId){
        const id = userId ? userId : undefined;
        const safeId = (id.match(/\d+/) || [])[0];
        if(safeId !== undefined) return this.songs.get(safeId);
        return false;
    }

    pop(id){
        const array = this.getArray(id);
        const deleted = array.pop();
        this.songs.set(id, array);
        return deleted;
    }

    getCollection() {
        return this.songs;
    }
}

module.exports = SongsArrayManager;
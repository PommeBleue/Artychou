const {Collection} = require('discord.js');


class SongsArrayManager {
    constructor(client, guild) {
        this.guild = guild;
        this.client = client;
        this.songs = new Collection();
    }

    async setSongsInArray(userId, songsArray){
        const client = this.client;
        const finder = client.packages["LyricsFinder"];
        const array = [];
        for(let i=0, len=songsArray.length; i<len; i++){
            const name = songsArray[i];
            let song = {};
            try {
                song = await finder.getSong(name);
            } catch (e) {
                return false;
            }
            array.push(song);
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
        console.log(array);
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
            array.push(song);
            this.songs.set(userId, array);
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
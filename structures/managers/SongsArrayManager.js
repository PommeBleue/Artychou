const {Collection} = require('discord.js');


class SongsArrayManager {
    constructor(client, guild) {
        this.guild = guild;
        this.client = client;
        this.songs = new Collection();
    }

    setSongsInArray(userId, songsArray){
        const client = this.client;
        const finder = client.packages["LyricsFinder"];
        const array = [];
        for(let i=0, len=songsArray.length; i<len; i++){
            const name = songsArray[i];
            const song = finder.getSong(name);
            array.push(song);
        }
        if(array.length !== 0){
            const safeId = (userId.match(/\d+/) || [])[0];
            this.songs.set(safeId, array);
            return this;
        }
        return false;
    }

    setArray(userId, array, guild){
        this.songs.set(userId, array);
        return this;
    }

    updateArrayInGuildObject(guild){

        return this;
    }
    getArray(userId){
        const id = userId ? userId : undefined;
        const safeId = (id.match(/\d+/) || [])[0];
        if(safeId !== undefined)return this.getArray(safeId);
        return false;
    }

    getCollection() {
        return this.songs;
    }
}

module.exports = SongsArrayManager;
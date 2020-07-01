const Enmap = require('enmap');
const SongsArrayManger = require('../managers/SongsArrayManager');

class SongsGuildManager {
    constructor(client) {
        this.client = client;
        this.userSongs = new Enmap({name: "userSongs", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }

    async init(){
        const map = this.userSongs;
        this.client.songs = {};
        const guilds = this.client.guilds.cache;
        for(let x in guilds.array()){
          const guild = guilds.array()[x];
          const id = guild.id;
            if(this.userSongs.has(id)) {
                const object = map.get(id);
                const manager = new SongsArrayManger(this.client, guild);
                for(const key in object) {
                    const value = object[key];
                    await manager.setSongsInArray(key, value);
                }
                this.client.songs[`songsarray_${guild.id}`] = manager;
                continue;
            }
            this.client.songs[`songsarray_${guild.id}`] = new SongsArrayManger(this.client, guild);
            console.log(this.client.songs[`songsarray_${guild.id}`]);
            this.userSongs.set(guild.id, {});
        }
        return this;
    }

    getUserSongsObject(guild){
        const result = {};
        const object = guild ? (this.userSongs.get(guild.id) ? this.userSongs.get(guild.id) : result) : result;
        object.forEach((key) => {
            result[key] = object[key] ?  object[key] : '';
        });
        return result;
    }

    getUserSongsArray(guild, id){
        return this.userSongs.get(guild.id)[id] ? this.userSongs.get(guild.id)[id] : [];
    }

    removeSongFromArray(guild, id, name){
        const defaults = {};
        const object = guild ? (this.userSongs.get(guild.id) ? this.userSongs.get(guild.id) : defaults) : defaults;
        const array = object[id] || undefined;
        if(array) {
           const newArray = array.filter(x => x !== name);
           this.setSongsArray(newArray, guild, id);
           return this;
        }
        return false;
    }

    setSongsArray(array, guild, userId) {
        if (guild === undefined || array === undefined || userId === undefined) return;
        const defaults = {};
        const isArray = Array.isArray(array);
        const object = guild ? (this.userSongs.get(guild.id) ? this.userSongs.get(guild.id) : defaults) : defaults;
        if (isArray) {
            object[userId] = array;
        }
        if(guild.id) this.userSongs.set(guild.id, object);
        return this;
    }
}

module.exports = SongsGuildManager;
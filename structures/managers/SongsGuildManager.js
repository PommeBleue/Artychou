const Enmap = require('enmap');
const SongsArrayManger = require('../managers/SongsArrayManager');

class SongsGuildManager {
    constructor(client) {
        this.client = client;
        this.userSongs = new Enmap({name: "userSongs", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }

    init(){
        const map = this.userSongs;
        this.client.songs = {};
        const guilds = this.client.guilds.cache;
        guilds.forEach((guild, id) => {
            if(this.userSongs.has(guild.id)) {
                const object = map.get(guild.id);
                const manager = new SongsArrayManger(this.client, guild);
                for(const key in object) {
                    const value = object[key];
                    manager.setSongsInArray(key, value);
                }
                this.client.songs[`songsarray_${guild.id}`] = manager;
            }
            this.client.songs[`songsarray_${guild.id}`] = {};
            this.userSongs.set(guild.id, {});
        });
    }

    getUserSongsObject(guild){
        const result = {};
        const object = guild ? (this.userSongs.get(guild.id) ? this.userSongs.get(guild.id) : result) : result;
        object.forEach((key) => {
            result[key] = object[key] ?  object[key] : '';
        });
        return result;
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
const EmbedBuilder = require('../../embed/EmbedBuilder');

class SongsListEmbed extends EmbedBuilder {
    constructor(songs, settings) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["blue_color"];
        this.title = settings["titles"]["standard_songs_list_title"];
        this.songs = songs;
    }

    build(opts = undefined) {
        let isTarget, target = false;
        if(opts) {
            isTarget = opts.isTarget;
            target = opts.target;
        }
        const array = [];
        const songs = this.songs;
        if(songs !== undefined && songs.length){
            for(let x in songs) {
                const song = songs[x];
                array.push(`**${Number(x)+1}.** ${song.getFullTitle ? song.getFullTitle() : song["song"]["full_title"]}`);
            }
        } else array.push(target && isTarget ? `${target} n'a aucune musique d'enregistrée ouin ouin` : "Vous n'avez aucune musique enregistrée ouin ouin.");
        const title = this.title;
        const footer = this.footer;
        const color = this.color;
        this.setTitle(title)
            .setDescription(array)
            .setColor(color)
            .setFooter(footer);

        return this;
    }
}

module.exports = SongsListEmbed;
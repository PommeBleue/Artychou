const EmbedBuilder = require('../../embed/EmbedBuilder');

class SongEmbed extends EmbedBuilder {
    constructor(songs, settings) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["blue_color"];
        this.title = settings["titles"]["standard_songs_list_title"];
        this.songs = songs;
    }

    build() {
        const array = [];
        const songs = this.songs;
        if(songs !== undefined && songs.length){
            for(let x in songs) {
                const song = songs[x];
                array.push(`**${Number(x)+1}.** ${song.getFullTitle()}`);
            }
        } else array.push("Vous n'avez aucune musique enregistrée ouin ouin.");
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

module.exports = SongEmbed;
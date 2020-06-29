const EmbedBuilder = require('../../embed/EmbedBuilder');

class SongsListEmbed extends EmbedBuilder {
    constructor(songs, settings) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["blue_color"];
        this.title = settings["standard_songs_list_title"];
        this.songs = songs;
    }

    build() {
        const array = [];
        const songs = this.songs;
        for(let x in songs) {
            const song = songs[x];
            array.push(`**${Number(x)+1}.** ${song.getTitle()} by ${song.getAuthor()}`);
        }
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
const EmbedBuilder = require("../../embed/EmbedBuilder");
const genius_logo = "https://media.discordapp.net/attachments/722185902243184780/728999502522089502/unknown.png";

class SongInfoEmbed extends EmbedBuilder {
    constructor(song, settings) {
        super();
        this.song = song;
        this.infos = {
            full_name: song.getFullTitle(),
            url: song.getUrl(),
            song_title: song.getTitle(),
            date: song.getReleaseDateForDisplay()
        };
        this.color = settings["colors"]["genius_color"];
        this.title = settings["titles"]["songs_info_standard_title"];
        this.description = settings["messages"]["standard_songs_info_message"].replace('[name]', this.infos["song_title"]).replace('[url]', this.infos["url"]);
        this.thumbnail = song.getImageUrl();
        this.footer = settings["messages"]["standard_songs_info_footer"].replace('[full_name]', this.infos["full_name"]).replace('[date]', this.infos["date"]);
    }

    build() {
        const song = this.song;
        const title = this.title;
        const description = this.description;
        const footer = this.footer;
        const album = song.getAlbumObject();
        const color = this.color;
        const thumbnail = this.thumbnail;
        this.setTitle(title)
            .setDescription(description)
            .setThumbnail(thumbnail)
            .addField('title', song.getTitle(), true)
            .addField('author', song.getAuthor(), true)
            .addField('album', `[${album ? album.name : 'pas d\'album pute'}](${album ? album.url : 'https://cned.fr'})`, true)
            .addField('lyrics', 'Envoyer `lyrics` dans le chat. Delay : `60s`',true)
            .addField('id', song.getId(), true)
            .setColor(color)
            .setFooter(footer, genius_logo);
        return this;
    }
}

module.exports = SongInfoEmbed;
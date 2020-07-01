const EmbedBuilder = require('../../embed/EmbedBuilder');

class LyricsEmbed extends EmbedBuilder {
    constructor(lyrics, settings, title = null) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["default_color"];
        this.title = title ? title : settings["titles"]["standard_lyrics_title"];
        this.lyrics = lyrics;
    }

    build() {
        const title = this.title;
        const lyrics = this.lyrics;
        const footer = this.footer;
        const color = this.color;
        this.setTitle(title)
            .setDescription(lyrics)
            .setColor(color)
            .setFooter(footer);

        return this;
    }
}

module.exports = LyricsEmbed;
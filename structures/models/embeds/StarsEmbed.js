const EmbedBuilder = require("../../embed/EmbedBuilder");
const { shorten } = require("../../../utils/UtilFunctions");


class StarsEmbed extends EmbedBuilder {
    constructor(body, settings) {
        super();
        this.body = body;
    }

    build() {
        const { body } = this;
        this.setTitle(body.title)
            .setDescription(shorten(body.explanation))
            .setColor(0x2E528E)
            .setAuthor(
                'Astronomy Picture of the Day',
                'https://i.imgur.com/Wh8jY9c.png',
                'https://apod.nasa.gov/apod/astropix.html'
            )
            .setImage(body.media_type === 'image' ? body.url : null)
            .setURL(body.url)
            .setFooter(`Image Credits: ${body.copyright ? body.copyright.replace(/\n/g, '/') : 'Public Domain'}`)
            .setTimestamp();
        return this;
    }

}

module.exports = StarsEmbed;
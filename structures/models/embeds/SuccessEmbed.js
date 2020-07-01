const EmbedBuilder = require('../../embed/EmbedBuilder');

class SuccessEmbed extends EmbedBuilder {
    constructor(message, settings) {
        super();
        this.color = (settings["colors"])["success_color"];
        this.title = settings["titles"]["peppas_title"];
        this.message = message;
    }

    build() {
        const title = this.title;
        const message = this.message;
        const color = this.color;
        this.setTitle(title)
            .setDescription(message)
            .setColor(color);

        return this;
    }
}

module.exports = SuccessEmbed;
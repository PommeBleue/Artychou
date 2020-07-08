const EmbedBuilder = require('../../embed/EmbedBuilder');

class SuccessEmbed extends EmbedBuilder {
    constructor(description, settings) {
        super();
        this.color = (settings["colors"])["success_color"];
        this.title = settings["titles"]["success_title"];
        this.description = description;
    }

    build() {
        const title = this.title;
        const description = this.description;
        const color = this.color;
        this.setTitle(title)
            .setDescription(description)
            .setColor(color);

        return this;
    }
}

module.exports = SuccessEmbed;
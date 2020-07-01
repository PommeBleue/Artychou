const EmbedBuilder = require('../../embed/EmbedBuilder');

class ErrorEmebed extends EmbedBuilder {
    constructor(error, settings) {
        super();
        this.footer = settings["standard_footer"];
        this.color = (settings["colors"])["error_color"];
        this.title = settings["titles"]["standard_error_title"];
        this.error = error;
    }

    build() {
        const title = this.title;
        const error = this.error;
        const footer = this.footer;
        const color = this.color;
        this.setTitle(title)
            .setDescription(error)
            .setColor(color)
            .setFooter(footer);

        return this;
    }
}

module.exports = ErrorEmebed;
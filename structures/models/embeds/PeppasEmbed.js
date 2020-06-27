const EmbedBuilder = require('../../embed/EmbedBuilder');

class PeppasEmbed extends EmbedBuilder {
    constructor({user, amount}, settings) {
        super();
        this.color = (settings["colors"])["default_color"];
        this.title = settings["peppas_title"];
        this.message = settings["peppas_standard_message"].replace("[user]", user).replace("[amount]", amount);
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

module.exports = PeppasEmbed;
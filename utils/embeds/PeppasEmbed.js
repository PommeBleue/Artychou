const EmbedBuilder = require("../../structures/embed/EmbedBuilder");

class PeppasEmbed extends EmbedBuilder {
    constructor() {
        super();

    }

    build() {
        this.setTitle("")
            .setDescription("")
            .setFooter("");
        return this;
    }


}

module.exports = PeppasEmbed;
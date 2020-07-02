const EmbedBuilder = require('../../embed/EmbedBuilder');

class SimpleEmbed extends EmbedBuilder {
    constructor(message) {
        super();
        this.message = message;
    }

    build() {
        const message = this.message;
        this.setDescription(message);
        return this;
    }
}

module.exports = SimpleEmbed;
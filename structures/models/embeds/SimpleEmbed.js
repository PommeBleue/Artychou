const EmbedBuilder = require('../../embed/EmbedBuilder');

class SimpleEmbed extends EmbedBuilder {
    constructor(message) {
        super();
        this.message = message ? message : '';
    }

    build() {
        const { message } = this;
        if(message === '') return this;
        this.setDescription(message);
        return this;
    }
}

module.exports = SimpleEmbed;
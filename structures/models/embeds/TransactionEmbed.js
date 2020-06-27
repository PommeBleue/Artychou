const EmbedBuilder = require('../../embed/EmbedBuilder');

class TransactionEmbed extends EmbedBuilder {
    constructor(error, settings) {
        super();
        this.color = (settings["colors"])["success_color"];
        this.title = settings["peppas_title"];
        this.message = settings["standard_transaction_message"];
    }

    build() {
        const title = this.title;
        const message = this.message;
        const footer = this.footer;
        const color = this.color;
        this.setTitle(title)
            .setDescription(message)
            .setColor(color);

        return this;
    }
}

module.exports = TransactionEmbed;
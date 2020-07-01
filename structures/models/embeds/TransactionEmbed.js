const EmbedBuilder = require('../../embed/EmbedBuilder');

class TransactionEmbed extends EmbedBuilder {
    constructor({amount, receiver}, settings) {
        super();
        this.color = (settings["colors"])["success_color"];
        this.title = settings["peppas_title"];
        this.message = settings["messages"]["standard_transaction_message"].replace("[amount]", amount).replace("[user]", receiver);
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

module.exports = TransactionEmbed;
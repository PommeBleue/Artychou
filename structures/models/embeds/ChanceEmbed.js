const EmbedBuilder = require("../../embed/EmbedBuilder");
const { stripIndents } = require('common-tags');

class ChanceEmbed extends EmbedBuilder {
    constructor(state, settings) {
        super();
        this.state = state;
        this.description = state ? settings["messages"]["win_chance_message"] : settings["messages"]["loose_chance_message"];
        this.color = state ? settings["colors"]["blue_color"] : undefined;
    }

    build(amount, author, user) {
        const { username } = author;
        const { bal } = user;
        const {description, state} = this;
        this.setDescription(stripIndents`
        ${description.replace('[amount]', amount > 0 ? amount : -1 * amount)}
        Tu as à présent : \`${bal}\` peppas.
        `)
            .setThumbnail(state ? "https://cdn.discordapp.com/emojis/725358167004807278.png?v=1" : "https://cdn.discordapp.com/emojis/402867193475366933.png?v=1")
            .setAuthor(username, author.avatarURL());
        return this;
    }
}

module.exports = ChanceEmbed;
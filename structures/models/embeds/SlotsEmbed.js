const EmbedBuilder = require("../../embed/EmbedBuilder");
const {stripIndents} = require('common-tags');

class SlotsEmbed extends EmbedBuilder {
    constructor(gain, bet, settings) {
        super();
        this.bet = bet;
        this.gain = gain;
    }

    build(chosen, author, user) {
        const {gain, bet} = this;
        const {username} = author;
        const {bal} = user;
        this.setDescription(stripIndents`
            ${gain ? 'Tu gagnes' : 'Tu perds'} \`${gain ? gain : bet}\` peppas. Tu as à présent \`${bal}\` peppas.
        `).setAuthor(username, author.avatarURL())
            .addField('Roulette', `**>** ${chosen.join(' ')} **<**`);
        return this;
    }
}

module.exports = SlotsEmbed;
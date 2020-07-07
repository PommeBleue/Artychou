const EmbedBuilder = require("../../embed/EmbedBuilder");
const s = require("underscore.string");

class DailyEmbed extends EmbedBuilder {
    constructor(response, settings) {
        super();
        this.response = response;
        this.title = settings["titles"]["daily_title"];
        this.description = settings["messages"]["daily_message"];
        this.color = settings["colors"]["daily_color"];
    }

    build() {
        const response = this.response;
        const {gain, special, streak} = response;
        const description = special ? `${this.description}. Ah oui, tu es un membre spécial, donc tu as deux fois plus de gains !` : this.description;
        this.setDescription(description.replace('[gain]', s.numberFormat(Number(gain))));
        if (streak > 0) this.addField('streak', `Tu es actuellement à ${streak > 1 ? `${streal} jours consécutifs.` : '1 gain quotidien récupéré'}`);
        return this;
    }

}

module.exports = DailyEmbed;
const EmbedBuilder = require("../../embed/EmbedBuilder");
const s = require("underscore.string");

class RemainingTimeEmbed extends EmbedBuilder {
    constructor(time, settings) {
        super();
        this.title = settings["titles"]["daily_title"];
        this.description = settings["messages"]["daily_remaining"].replace('[time]', time);
        this.color = settings["colors"]["daily_color"];
    }

    build(streak) {
        if(streak > 0) this.addField('Jous consécutifs', streak);
        return this;
    }

}

module.exports = RemainingTimeEmbed;
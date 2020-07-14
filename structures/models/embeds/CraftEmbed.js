const EmbedBuilder = require("../../embed/EmbedBuilder");

class CraftEmbed extends EmbedBuilder {
    constructor(crafts, settings) {
        super();
        this.crafts = crafts;
        this.description = settings["messages"]["craft_message"];
        this.color = settings["colors"]["blue_color"];
    }

    build(body) {
        const { number } = body;
        const { description, crafts } = this;
        for (const [craft, people] of Object.entries(crafts)) {
            this.addField(`❯ ${craft} (${people.length})`, people.join('\n'), true);
        }
        let desc = description.replace('[int]', number);
        this.setDescription(desc);
        return this;
    }
}

module.exports = CraftEmbed;
const EmbedBuilder = require("../../embed/EmbedBuilder");

class ISSPositionEmbed extends EmbedBuilder {
    constructor(position, settings) {
        super();
        this.position = position;
        this.title = settings["titles"]["iss_title"];
        this.description = settings["messages"]["iss_message"];
        this.color = settings["colors"]["blue_color"];
    }

    build() {
        const { position, description } = this;
        const { longitude, latitude } = position;
        this.description = description.replace('[long]', longitude).replace('[lat]', latitude);
        this.setFooter('API : http://api.open-notify.org/iss-now');
        return this;
    }

}

module.exports = ISSPositionEmbed;
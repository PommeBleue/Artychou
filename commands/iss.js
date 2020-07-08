const Command = require("../structures/Command");
const got = require("got");
const ISSPositionEmbed = require("../structures/models/embeds/ISSPositionEmbed");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class ISSCommand extends Command {
    constructor(client) {
        super(client, {
            name: "whereisiss",
            description: "Vous dit les coordonnées de la position actuelle de la station spatiale internationale.",
            category: "Big Brain, Tiny Muscles",
            usage: "tip iss",
            aliases: ["iss"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { config } = this.client;
        const { apis : { iss : { apiUrl } } } = config;
        const { channel, settings } = message;
        try {
            const {body} = await got(apiUrl);
            const obj = JSON.parse(body);
            const position = obj.iss_position;
            const embed = new ISSPositionEmbed(position, settings).build();
            return await channel.send({embed});
        } catch (e) {
            const error = new ErrorEmbed(`OH NON ! ${e.message} : ${e.code}`, settings).build();
            return await channel.send({embed: error});
        }
    }
}

module.exports = ISSCommand;
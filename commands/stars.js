const Command = require("../structures/Command");
const StarsEmbed = require("../structures/models/embeds/StarsEmbed");
const request = require('node-superfetch');

const NASA_KEY = process.env.NASA;

class Stars extends Command {
    constructor(client) {
        super(client, {
            name: "stars",
            description: "",
            category: "Big Brain, Tiny Muscles",
            usage: "tip stars",
            aliases: ["étoiles", ""],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel, settings } = message;
        const { body } = await request
            .get('https://api.nasa.gov/planetary/apod')
            .query({ api_key: NASA_KEY });
        const embed = new StarsEmbed(body, settings).build();
        return await channel.send({embed});

    }
}

module.exports = Stars;
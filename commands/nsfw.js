const Command = require("../structures/Command");


class Nsfw extends Command {
    constructor(client) {
        super(client, {
            name: "nsfw",
            description: "Gros pervers.",
            usage: "tip nsfw",
            aliases: ["not-safe-for-work"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel } = message;
        return await channel.send('Gros pervers.');
    }
}

module.exports = Nsfw;
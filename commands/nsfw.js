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
        const responses = ["Va sur Pornhub, ne souille pas la terre pure de Déesse mathématique.", "e suis mineure, j'appelle la police.", "Gros pervers.", "Apprends à contrôler tes plusions, et dégage d'ici tant qu'à faire."];
        return await channel.send(responses[Math.floor(Math.random() * responses.length)]);
    }
}

module.exports = Nsfw;
const Command = require("../structures/Command");
const SimpleEmbed = require("../structures/models/embeds/SimpleEmbed");
const got = require("got");

class DogCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dog",
            category: "c mignon",
            description: "Des chiens",
            usage: "tip dog",
            aliases: ["d"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel } = message;
        try {
            let url;
            do {
                let current = await got("https://random.dog/woof");
                url = current.body
            } while (!url || url.endsWith('.mp4'));

            const embed = new SimpleEmbed().setTitle('Dogs').setImage(`https://random.dog/${url}`);
            await channel.send({embed});
        } catch (e) {
            throw e;
        }
    }
}

module.exports = DogCommand;
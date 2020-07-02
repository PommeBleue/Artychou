const Command = require("../structures/Command");

class Reverse extends Command {
    constructor(client) {
        super(client, {
            name: "reverse",
            description: "Inverse l'ordre des lettres.",
            category: "string",
            usage: "reverse [str]",
            aliases: ["esrever"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        if (args.length) {
            const s = message.stringmanip;
            const argz = args.map(x => s.clean(x));
            const content = argz.join(' ');
            return await channel.send(s.reverse(content));
        }

        return await channel.send('Marlin Bleu !');
    }
}

module.exports = Reverse;
const Command = require("../structures/Command");

class SwapCase extends Command {
    constructor(client) {
        super(client, {
            name: "swapcase",
            description: "Inverse les majuscules et minuscules.",
            category: "string",
            usage: "swapcase [str]",
            aliases: ["swapc"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        if (args.length) {
            const s = message.stringmanip;
            const argz = args.map(x => s.clean(x));
            const content = argz.join(' ');
            return await channel.send(s.swapCase(content));
        }

        return await channel.send('Chaperon Rouge !');
    }
}

module.exports = SwapCase;
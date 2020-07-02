const Command = require("../structures/Command");

class Capitalize extends Command {
    constructor(client) {
        super(client, {
            name: "capitalize",
            description: "Rend votre phrase belle.",
            urlDescription: "https://en.wikipedia.org/wiki/Levenshtein_distance",
            category: "string",
            usage: "capitalize [str]",
            aliases: ["cap", "firtmaj"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        if (args.length) {
            const s = message.stringmanip;
            const argz = args.map(x => s.clean(x));
            const content = argz.join(' ');
            return await channel.send(s.capitalize(content));
        }

        return await channel.send('Paris !');
    }
}

module.exports = Capitalize;
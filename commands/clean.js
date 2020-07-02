const Command = require("../structures/Command");

class Clean extends Command {
    constructor(client) {
        super(client, {
            name: "clean",
            description: "Efface les espaces pas nécessaires.",
            urlDescription: "https://en.wikipedia.org/wiki/Levenshtein_distance",
            category: "string",
            usage: "clean [str]",
            aliases: [],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        if (args.length) {
            const s = message.stringmanip;
            const argz = args.map(x => s.clean(x));
            const content = argz.join(' ');
            return await channel.send(s.clean(content));
        }

        return await channel.send('Somme Harmonique.');
    }
}

module.exports = Clean;
const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class Count extends Command {
    constructor(client) {
        super(client, {
            name: "count",
            description: "Compte les récurrences d'une chaîne de caractères dans une autre.",
            category: "string",
            usage: "count [str1] | [str2]",
            aliases: [],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        if (args.length) {
            if (!args.includes('|')) {
                const error = new ErrorEmbed("Séparer les deux chaînes que vous voulez comparer d'un `|`", message.settings);
                return await channel.send({embed: error});
            }
            const s = message.stringmanip;
            const argz = args.map(x => s.clean(x));
            const array1 = [];
            const array2 = [];
            let whichOne = 0;
            for (let i = 0; i < argz.length; i++) {
                const current = argz[i];
                if (current === '|') {
                    whichOne++;
                    continue;
                } if (whichOne === 0) {
                    array1.push(current);
                    continue;
                }
                array2.push(current);
            }
            const str1 = array1.join(' ');
            const str2 = array2.join(' ');
            const result = s.count(str1, str2);
            return await channel.send(`${str2} est présent **${result}** fois dans ${str1}`);
        }

        return await channel.send('Pique-nique douille, c\'est toi l\'andouille.');
    }
}

module.exports = Count;
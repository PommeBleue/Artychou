const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const SimpleEmbed = require("../structures/models/embeds/SimpleEmbed");

class Matrix extends Command {
    constructor(client) {
        super(client, {
            name: "matrix",
            description: "Fait une matrice carrée de taille 3 dont tous les coefficients sont représentés par un émoji.",
            urlDescription: "https://en.wikipedia.org/wiki/Levenshtein_distance",
            category: "string",
            usage: "matrix [émoji]",
            aliases: ["em"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        const random = Math.floor(Math.random() * 4);
        if (args.length) {
            if(args.length === 1) {
                const emote = args[0];
                const emoteSpace = `${emote} `;
                const isEmote = /<:([a-zA-Z]+):(\d{18})>$/gm.test(emote);
                if(!isEmote) {
                    const error = new ErrorEmbed("Ce que tu as mis n'est pas un émoji.", message.settings).build();
                    return await channel.send({embed : error});
                }
                const array = [];
                for(let i = 0; i < random + 3; i++ ) {
                    array.push(this.multiply(emoteSpace, random+3));
                }
                const embed = new SimpleEmbed(array).build();
                return await channel.send({embed});
            }
        }

        return await channel.send('Djibouti !');
    }

    multiply(str, int) {
        if (isNaN(int)) throw new TypeError();
        const array = [];
        for (let i = 0; i < int; i++) {
            array.push(str);
        }
        return array.join("");
    }
}

module.exports = Matrix;
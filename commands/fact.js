const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const got = require("got");

const { stripIndents } = require('common-tags');
const {FACTS} = require("../utils/types/TypeUtil");

class Fact extends Command {
    constructor(client) {
        super(client, {
            name: "fact",
            category: "Big Brain, Tiny Muscles",
            description: "En vrai je sais pas quoi mettre lol Sou m'aidera à modifer cette description",
            usage: "tip fact [type]",
            aliases: ["f"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const {channel, settings} = message;
        try {
            const arg = args[0] ? args[0] : FACTS[Math.floor(Math.random() * FACTS.length)];
            if (!FACTS.includes(arg)) throw new Error(stripIndents`
            Not so valid type.
            Valid types : ${FACTS.map(x => `\`${x}\``).join(' ')}
            `);
            const url = `https://some-random-api.ml/facts/${arg}`;
            const { body } = await got(url);
            const { fact } = JSON.parse(body);
            return await channel.send(fact);
        } catch (e) {
            const error = new ErrorEmbed(e.message, settings).build();
            return await channel.send({embed: error});
        }
    }
}

module.exports = Fact;
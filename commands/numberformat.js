const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class NumberFormat extends Command {
    constructor(client) {
        super(client, {
            name: "numberformat",
            description: "Vous aide un peu.",
            category: "util-public",
            usage: "help [command]",
            aliases: ["nf"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        const s = message.stringmanip;
        const arg = args.join('');
        const canFormat = /^\d+$/gm.test(arg);
        const returnString = canFormat ? s.numberFormat(Number(arg), 0) : false;
        if(!returnString) {
            const error = new ErrorEmbed('Pas le bon format. Regex : \`/^\\d+$/gm\`.', message.settings);
            return await channel.send({embed: error});
        }
        return await channel.send(returnString);
    }
}

module.exports = NumberFormat;
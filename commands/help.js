const Command = require("../structures/Command");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Vous aide un peu.",
            category: "util-public",
            usage: "help [command]",
            aliases: ["?", "h", "aide-moi_slp"],
            params: [

            ]
        });
    }

    async run(message, args, lvl) {
        await message.channel.send("La commande help n'est toujours pas configurée, pute.");
    }
}

module.exports = Help;
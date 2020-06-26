const Command = require("../structures/Command");
const {getMemberByMixed} = require("../utils/SearchUtils");

class Peppas extends Command {
    constructor(client) {
        super(client, {
            name: "peppas",
            description: "Vous aide un peu.",
            category: "economy",
            usage: "peppas @[user] @![give]${user}",
            aliases: ["blé", "money", "bal", "<:peppas:713401565737910352>", "💵"],
            defaultFetch: ({str, guild}) => getMemberByMixed(str, guild),
            params: [
                {
                    name: "user",
                    alias: ["u"],
                    type: ["UserID", "Username", "Username#XXXX"],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => getMemberByMixed(input, ov.guild),
                    iParseFail: () => false
                },
                {
                    name: "amount",
                    alias: ["g"],
                    type: ["int"],
                    requires: [0],
                    optional: true
                }
            ]
        });
    }

    async run(message, args, lvl, data) {
        await message.channel.send(`Tiens <@!${data.user.id}>, ${message.author.username} a décidé de te donner ${data.amount}`);
    }
}

module.exports = Peppas;
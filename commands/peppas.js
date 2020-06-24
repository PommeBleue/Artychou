const Command = require("../structures/Command");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "peppas",
            description: "Vous aide un peu.",
            category: "economy",
            usage: "peppas @[user] @![give]${user}",
            aliases: ["blé", "money", "bal", "<:peppas:713401565737910352>", "💵"],
            params: [
                {
                    name: "user",
                    alias: ["u"],
                    type: ["UserID", "Username", "Username#XXXX"],
                    spacedString: true,
                    iParse: () => true,
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

    async run(message, args, lvl) {

    }
}

module.exports = Help;
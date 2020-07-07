const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class TeamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "teams",
            description: "Base command for teams.",
            category: "teams",
            usage: "tip teams [action] [arguments]",
            guildOnly: true,
            params: []
        });
    }

    async run(message, args, lvl, data) {
    
    }
}

module.exports = TeamsCommand;
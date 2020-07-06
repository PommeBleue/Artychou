const Command = require("../structures/Command");
const HelpEmbed = require("../structures/models/embeds/HelpEmbed");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const CommandInfoEmbed = require("../structures/models/embeds/CommandInfoEmbed");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Vous aide un peu.",
            category: "util-public",
            usage: "help [command]",
            aliases: ["?", "h", "aled"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        const cache = this.client.levelCache;
        const commands = this.client.handler.getCommands();
        const aliases = this.client.handler.getAliases();
        const avatar = this.client.user.avatarURL();


        if(args.length) {
            const name = args[0];
            const command = commands.get(name) || aliases.get(name);
            if(!command) {
                const error = new ErrorEmbed('Command not found.', message.settings);
                return await channel.send({embed: error});
            }
            const embed = new CommandInfoEmbed(command, message.settings).build(avatar);
            return await channel.send({embed});

        }

        const help = new HelpEmbed(commands, message.settings).build(lvl, cache);
        await channel.send({embed: help})
    }

}

module.exports = Help;
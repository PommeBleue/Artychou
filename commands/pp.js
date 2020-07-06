const Command = require("../structures/Command");
const util = require("../utils/SearchUtils");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class ProfilePicture extends Command {
    constructor(client) {
        super(client, {
            name : "profilepicture",
            description: "Affiche ta photo de profile ou celle de quelqu'un",
            category: "util-public",
            usage: "pp @[user]",
            guildOnly: true,
            aliases: ["pp", "taphotosalope"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const user = message.author;
        const channel = message.channel;
        const guild = channel.guild;
        let url = user.avatarURL();

        if(args.length) {
            const name = args.join(' ');
            const target = util.getMemberByMixed(name, guild);
            if(!target) {
                const error = new ErrorEmbed('User not found.', message.settings).build();
                return await channel.send({embed: error});
            }
            url = target.user.avatarURL();
            return await channel.send(`${url}?size=256`);
        }

        await channel.send(`${url}?size=256`);
    }
}

module.exports = ProfilePicture;
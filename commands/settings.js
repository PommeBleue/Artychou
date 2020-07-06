const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const SettingsKeysEmbed = require("../structures/models/embeds/SettingsKeysEmbed");
const SuccessEmbed  = require("../structures/models/embeds/SuccessEmbed");

class SettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "settings",
            description: "Flemme de la mettre mtn lol",
            category: "util",
            usage: "settings @[path] @[value]${path}",
            aliases: ["s"],
            defaultFetch: ({str}) => str,
            params: [
                {
                    name: "path",
                    alias: ["p"],
                    type: ["string"],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => input
                },
                {
                    name: "set",
                    alias: ["s"],
                    type: ["string"],
                    requires: [0],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => input
                }
            ],
            permLevel: "Bot Owner"
        });
    }

    async run(message, args, lvl, data) {
        const guild = message.guild;
        const module = this.client.packages["SettingsModifier"];

        console.log('entered');

        if (data && data.defaults) {
            const str = data.defaults;
            const path = data.defaults.split(/\s/);
            const obj = module.getSettingsInObjectWithPath(path, guild);
            if (!obj) {
                const error = new ErrorEmbed("Chemin erroné, peux-tu réessayer ma belle ?", message.settings).build();
                return await message.channel.send({embed: error});
            }
            const embed = this.embedWithPath(obj, message.settings, str);
            await message.channel.send({embed});
            return false;
        }

        if (data && typeof data === 'object') {
            if (data["path"] && data["set"]) {
                const path = data["path"].split(/\s/);
                const newValue = data["set"];
                const safeNewValue = (newValue === 'true' || newValue === 'false') ? (newValue === 'true') : (/^\d+$/.test(newValue) ? Number(newValue) : newValue);
                const bool = module.modify(path, guild, safeNewValue);
                if (!bool) return false;
                const embed = new SuccessEmbed(`${data["path"]} a été modifié avec succès. Nouvelle valeur \`${data["set"]}\``, message.settings).build();
                return await message.channel.send({embed});
            }


            return false;
        }

        const readOnly = module.getReadOnlySettings();
        if (!readOnly) {
            const error = new ErrorEmbed("Une erreur s'est produite, tu peux réessayer pour voir ma belle ?", message.settings).build();
            await message.channel.send({embed: error});
        }
        const embed = this.getDefaultKeys(readOnly, message.settings);
        await message.channel.send({embed});
    }

    embedWithPath(obj, settings, path) {
        const type = obj.type !== undefined;
        const embed = new SettingsKeysEmbed(type, settings, path);
        if (type) {
            for (const key in obj) {
                embed.addField(String(key), obj[key]);
            }
            embed.addField('path', path);
        } else {
            const array = [];
            for (const key in obj) {
                array.push(`**${key}**`);
            }
            embed.addField('keys', array);
        }
        return embed.build();
    }

    getDefaultKeys(obj, settings){
        const embed = new SettingsKeysEmbed(false, settings, '');
        for(const key in obj){
            const current = obj[key];
            if(current.changeable) {
                embed.addField(key, [`\`description\` : ${current.description}`, `\`type\` : ${current.type}`]);
            }
        }
        return embed.build();
    }
}

module.exports = SettingsCommand;
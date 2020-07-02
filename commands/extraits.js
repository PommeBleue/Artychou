const Command = require("../structures/Command");
const SimpleEmbed = require("../structures/models/embeds/SimpleEmbed");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "extraits",
            description: "Active ou desactive les réponses aux extraits.",
            category: "util",
            usage: "help [command]",
            aliases: ["?", "h", "aide-moi_slp"],
            params: [],
            permLevel: "Bot Admin"
        });
    }

    async run(message, args, lvl, data) {
        const guild = message.guild;
        const channel = message.channel;
        const settings = message.settings;
        const activated = settings["extraits"]["activated"];
        const modified = activated === "true" ? "false" : "true";
        this.client.settingsHandler.setSettings(guild.id, {extraits: {activated : modified}});
        return await this.sendEmbed(channel, modified, settings);
    }

    async sendEmbed(channel, modified, settings) {
        const state = modified === "true";
        const embed = new SimpleEmbed(`Réponses par des répliques ${state ? "activées" : "désactivées"}`)
            .setColor(state ? settings["colors"]["success_color"] : settings["colors"]["error_color"])
            .build();
        return await channel.send({embed});
    }

}

module.exports = Help;
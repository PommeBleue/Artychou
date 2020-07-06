const EmbedBuilder = require("../../embed/EmbedBuilder");

class CommandInfoEmbed extends EmbedBuilder {
    constructor(command, settings) {
        super();
        this.title = settings["titles"]["command_info_title"].replace('[command]', command.help.name);
        this.description = command.help.description;
        this.color = settings["colors"]["blue_color"];
        this.footer = settings["standard_footer"];
        this.command = command;
    }

    build(avatar) {
        const command = this.command.help;
        const description = this.description;
        const title = this.title;
        const color = this.color;
        const footer = this.footer;

        this.setTitle(title)
            .setDescription(description)
            .addField('usage', command.usage, true)
            .addField('category', command.category, true)
            .addField('aliases', command.aliases.map(e => `\`${e}\``).join(' '), true)
            .addField('exemples', this.command.examples.join('\n'))
            .setColor(color)
            .setFooter(footer, avatar);
        return this;
    }
}

module.exports = CommandInfoEmbed;
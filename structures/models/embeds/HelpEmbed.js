const EmbedBuilder = require("../../embed/EmbedBuilder");
const { Collection } = require("discord.js");


class HelpEmbed extends EmbedBuilder {
    constructor(commands, settings) {
        super();
        this.commands = commands;
        this.title = settings["titles"]["help_title"];
        this.description = settings["messages"]["help_message"];
        this.color = settings["colors"]["default_color"];
        this.footer = settings["standard_footer"];
        this.collection = new Collection();
    }

    build(lvl, cache) {
        const commands = this.commands;
        const title = this.title;
        const description = this.description;
        const color = this.color;
        const footer = this.footer;
        this.setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter(footer);
        this.getCategoriesCollection(commands, lvl, cache);
        const keys = this.collection.keyArray();
        for(let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            const value = this.collection.get(key);
            this.addField(key, value.map(e => `\`${e.help.name}\``).join(' '), true);
        }
        return this;
    }

    getCategoriesCollection(commands, lvl, cache) {
        const keys = commands.keyArray().filter(e =>  e !== 'help');
        for (let i = 0; i < keys.length; i ++) {
            const key = keys[i];
            const value = commands.get(key);
            if(lvl < cache[value.conf.permLevel]) continue;
            const category = value.help.category;
            if(this.collection.has(category)) {
                this.collection.get(category).push(value);
                continue;
            }
            this.collection.set(category, [value]);
        }
    }
}

module.exports = HelpEmbed;
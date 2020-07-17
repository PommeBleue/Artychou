const path = require('path');
const Command = require("../structures/Command");
const SimpleEmbed = require("../structures/models/embeds/SimpleEmbed");
const json = require("../utils/UtilsJson");

class Capybara extends Command {
    constructor(client) {
        super(client, {
            name: "capybara",
            description: "none",
            category: "c mignon",
            usage: "tip capybara",
            aliases: ["capybaras"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel } = message;
        const { files } = json.readJsonSync(path.join(__dirname, '..','structures', 'models', 'json', 'capybaras.json'));
        const element = files[Math.floor(Math.random() * files.length)];
        const embed = new SimpleEmbed(element[1]).build();
        embed.setTitle('Capybaras')
            .setImage(element[0]);
        return await channel.send({embed});
    }
}

module.exports = Capybara;
const got = require("got");

const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const SimpleEmbed = require("../structures/models/embeds/SimpleEmbed");

const urls = ["https://some-random-api.ml/img/cat", "http://aws.random.cat/meow"];

class Cat extends Command {
    constructor(client) {
        super(client, {
            name: "cat",
            description: "Soit tu aimes les chats soit je te torture les rotules",
            category: "c mignon",
            usage: "tip cat",
            aliases: ["cats"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel, settings } = message;
        try {
            let file;
            let url;
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    url = urls[0];
                    const { body } = await got(url);
                    const { link } = JSON.parse(body);
                    file = link;

                    break;
                case 1:
                    url = urls[1];
                    const result = await got(url);
                    const _body = result["body"];
                    file = JSON.parse(_body)["file"].split('').filter(e => e!== '\\').join('');
                    break;
            }
            const embed = new SimpleEmbed();
            embed.setTitle('Cats')
                .setImage(file)
                .setColor(settings["colors"]["default_color"]);
            return await channel.send({embed});

        } catch (e) {
            const error = new ErrorEmbed(e.message, settings).build();
            return await channel.send({embed: error});
        }
    }

}

module.exports = Cat;
const Command = require("../structures/Command");
const img = "/Users/mac/WebstormProjects/artychou2/src/img/hope.jpg";

class Hope extends Command {
    constructor(client) {
        super(client, {
            name: "hope",
            description: "Ne te suicide pas et garde espoir, il y'a toujours pire dans la vie. Rééquilibre le niveau de dépression du serveur..",
            category: "fun",
            aliases: ["hein"]
        });
    }

    async run(message, args, lvl, date) {
        return await message.channel.send({files: [{attachment: img, name: "hope.jpg"}]});
    }

}

module.exports = Hope;
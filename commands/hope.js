const Command = require("../structures/Command");
const img = "/Users/mac/WebstormProjects/artychou2/src/img/hope.jpg";

class Hope extends Command {
    constructor(client) {
        super(client, {
            name: "hope",
            description: "L'espoir fait vivre.",
            category: "fun",
            aliases: ["hein"]
        });
    }

    async run(message, args, lvl, date) {
        return await message.channel.send({files: [{attachment: img, name: "hope.jpg"}]});
    }

}

module.exports = Hope;
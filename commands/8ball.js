const Command = require("../structures/Command");

class EightBall extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            description: "Vous aide un peu.",
            category: "util-public",
            defaultFetch: ({str}) => str,
            usage: "help [command]",
            aliases: ["8", "boule8"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const channel = message.channel;
        const responses = this.client.packages["EightBallResponses"];
        if(args.length) {
            const response = responses.getRandomResponse(message);
            return await channel.send(response);
        }

        await channel.send("Minecraft c'est le meilleur des jeux.");
    }
}

module.exports = EightBall;
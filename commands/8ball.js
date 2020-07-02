const Command = require("../structures/Command");

class EightBall extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            description: "Répond à une question.",
            category: "fun",
            defaultFetch: ({str}) => str,
            usage: "8ball [question]",
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
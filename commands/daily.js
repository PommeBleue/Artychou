const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const DailyEmbed = require("../structures/models/embeds/DailyEmbed");
const RemainingTimeEmbed = require("../structures/models/embeds/RemainingTimeEmbed");


class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Faites-vous de l'argent",
            usage: "tip daily",
            aliases: ["d"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const {usermanager, modules} = this.client;
        const {author, channel, settings} = message;
        const {guild} = channel;
        const {id} = author;
        const user = usermanager.getUserById(id);
        if (!user) throw new Error();
        const daily = modules.module('Daily');
        const dailyResponse = modules.module('DailyResponses');
        if (daily.check(id)) {
            const response = dailyResponse.respond(user);
            user.setDaily(response.getStreak());
            user.setBalance(user.getBalance() + response["gain"]);
            await this.client.usermanager.UpdateUserAsync(user);
            this.client.usermanager.UpdateUserLocal(id, user);
            daily.newClaimedAt(id);
            const embed = new DailyEmbed(response, settings).build();
            return await channel.send({embed});
        } else if (typeof daily.check(id) === 'string') {
            if (daily.check(id) === 'out') {
                daily.newClaimedAt(id);
                user.setDaily(0);
                const {gain, special} = dailyResponse.respond(user);
                user.setBalance(user.getBalance() + response["gain"]);
                await this.client.usermanager.UpdateUserAsync(user);
                this.client.usermanager.UpdateUserLocal(id, user);
                const embed = new DailyEmbed({gain, special, streak: 0}, settings).build();
                return await channel.send({embed});
            } else {
                daily.newClaimedAt(id);
                const response = dailyResponse.respond(user);
                user.setDaily(1);
                user.setBalance(user.getBalance() + response["gain"]);
                await this.client.usermanager.UpdateUserAsync(user);
                this.client.usermanager.UpdateUserLocal(id, user);
                const embed = new DailyEmbed(response, settings).build();
                return await channel.send({embed});
            }
        } else {
            const time = daily.getRemaining(id);
            const embed = new RemainingTimeEmbed(time, settings).build(user.getDaily());
            return await channel.send({embed});
        }
    }
}

module.exports = Daily;
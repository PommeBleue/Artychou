const Command = require("../structures/Command");
const ChanceEmbed = require("../structures/models/embeds/ChanceEmbed");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const { numberFormat } = require("underscore.string");

class Chance extends Command {
    constructor(client) {
        super(client, {
            name: "chance",
            description: "none",
            category: "economy",
            usage: "tip chance [int]",
            aliases: ["ploufplouf", "pf"],
            params: []
        });

    }

    async run(message, args, lvl, data) {
        const {client} = this;
        const {channel, settings, author} = message;
        const {id} = author;
        const {usermanager, config} = client;
        const special = config.special.includes(id);
        const user = usermanager.getUserById(id);
        const {bal} = user;
        const arg = args.length ? args[0] : 1000;
        if (!(/\d+/.test(arg))) return false;
        const chance = Number(arg);
        const maxLoss = (chance * 1000) / (chance - 1);
        if (user.getBalance() < maxLoss) {
            const error = new ErrorEmbed(`Tu n'as pas assez de peppas malheureusement. Il te manque \`${numberFormat(maxLoss - user.getBalance())}\``, settings).build();
            return await channel.send({embed: error});
        }
        const win = Math.floor(Math.random() * chance) === 0;
        if (win) {
            const gainDecimal = special ? chance * 1000 * 2 : chance * 1000;
            const gain = Math.floor(gainDecimal);
            user.setBalance(bal + gain);
            usermanager.UpdateUserLocal(id, user);
            await usermanager.UpdateUserAsync(user);
            const embed = new ChanceEmbed(win, settings).build(gain, author, user);
            return await channel.send({embed});
        }
        const lossDecimal = special ? maxLoss / 2 : maxLoss;
        const loss = Math.floor(lossDecimal);
        user.setBalance(bal - loss);
        usermanager.UpdateUserLocal(id, user);
        await usermanager.UpdateUserAsync(user);
        const embed = new ChanceEmbed(win, settings).build(-1 * loss, author, user);
        return await channel.send({embed});
    }
}

module.exports = Chance;
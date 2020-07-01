const Command = require("../structures/Command");
const Transaction = require("../structures/models/transactions/Transaction");
const TransactionEmbed = require("../structures/models/embeds/TransactionEmbed");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const PeppasEmbed = require("../structures/models/embeds/PeppasEmbed");
const {getMemberByMixed} = require("../utils/SearchUtils");

class Peppas extends Command {
    constructor(client) {
        super(client, {
            name: "peppas",
            description: "Vous aide un peu.",
            category: "economy",
            usage: "peppas @[user] @[give]${user}",
            aliases: ["blé", "money", "bal", "<:peppas:713401565737910352>", "💵"],
            defaultFetch: ({str, mov}) => getMemberByMixed(str, mov.guild),
            defaultError: "",
            params: [
                {
                    name: "user",
                    alias: ["u"],
                    type: ["UserID", "Username", "Username#XXXX"],
                    spacedString: true,
                    optional: true,
                    iParse: ({input, ov}) => getMemberByMixed(input, ov.guild),
                    iParseFail: () => false
                },
                {
                    name: "amount",
                    alias: ["g"],
                    type: ["int", "toParseInt"],
                    iParse : ({input, ov}) => /^\d+$/.test(String(input)) ? Number(input) : this.client.func.parseInt(input),
                    regexType: (str) => /^[^.°][0-9]*(k|m)?$/gm.test(str.toLowerCase()),
                    strictMatch: true,
                    requires: [0],
                    optional: true
                }
            ]
        });
    }

    async run(message, args, lvl, data) {
        const settings = message.settings;
        const channel = message.channel;
        const author = message.author;
        const user = message.users.getUserById(author.id);
        const balance = user.getBalance();

        if(data && data.defaults) {
            const target = data.defaults.user;
            const targetId = target.id;
            const targetUser = message.users.getUserById(targetId);
            const targetBalance = targetUser.getBalance();

            const peppas = new PeppasEmbed({user: target.username, amount: message.func.numberFormat(targetBalance)}, settings).build();
            return await channel.send({embed: peppas});
        }

        if(data && typeof data === 'object') {
            console.log('object', data);
            const sender = author.id;
            const receiver = data.user ? data.user.user.id : undefined;
            const amount = data.amount ? data.amount : undefined;

            if(receiver === undefined || amount === undefined) {
                const error = new ErrorEmbed((settings["error_messages"])["option_received_not_valid"], settings).build();
                return await channel.send({embed: error});
            }

            console.log(sender);
            console.log(receiver);

            const transfer = new Transaction({sender, receiver}, message);
            const response = await transfer.init(amount);

            if(response && typeof response === 'object') {
                const embed = new TransactionEmbed({amount: response.amount, receiver: response.receiver.username}, settings).build();
                return await channel.send({embed});
            }
        } else {
            const peppas = new PeppasEmbed({user: user.username, amount: message.func.numberFormat(balance)}, settings).build();
            return await channel.send({embed: peppas});
        }



    }
}

module.exports = Peppas;
const Command = require("../structures/Command");
const Transaction = require('.')
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
                    iParse : ({input, ov}) => this.client.func.parseInt(input),
                    regexType: new RegExp(/^[^\.\°][0-9]+(k|K|m|M)?$/, 'gm'),
                    requires: [0],
                    optional: true
                }
            ]
        });
    }

    async run(message, args, lvl, data) {


        if(data.default) {

        }

        if(data) {
            const sender = message.user.id;
            const receiver = data.user.user.id;
            const amount = data.amount;

            const transfer = new Transaction(sender, receiver);
            const response = await transfer.init(amount);

            if(response && typeof response === 'object') {

            }
        }



    }
}

module.exports = Peppas;
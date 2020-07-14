const Command = require("../structures/Command");
const { MersenneTwister19937, integer } = require('random-js');
const { getMemberByMixed } = require("../utils/SearchUtils");
const { capitalize } = require("underscore.string");

const NICE = ["[sujet] [avoir] un cerveau en or, et [etre] une personne en or.", "[sujet] [avoir] 174 points de quotient intellectuel"];

class IQCommand extends Command {
    constructor(client) {
        super(client, {
            name: "iq",
            description: "",
            category: "fun",
            usage: "tip iq [user]",
            aliases: ["quotienintellectuel"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { client : { config } } = this;
        const { channel, settings, author, guild } = message;
        const arg = args[0] ? args[0] : author.id;
        const member = getMemberByMixed(arg, guild);
        if(!member) throw new Error('User not found.');
        const { user : {id, username} } = member;
        const special = config.special.includes(id);
        if(special) {
            const str = NICE[Math.floor(Math.random() * NICE.length)];
            const phrase = args.length ? str.replace("[sujet]", username).replace('[avoir]', 'a').replace("[etre]", "est") : str.replace("[sujet]", "tu").replace('[avoir]', 'as').replace("[etre]", "es");
            return await channel.send(capitalize(phrase));
        }
        const random = MersenneTwister19937.seed(id);
        const score = integer(20, 170)(random);
        return channel.send(`${args.length ? `${username} a` : 'Tu as'} ${score} de quotient intellectuel.` + `${score < 100 ? ' Ça ne m\'étonne pas que tu sois stupide.' : score > 150 ? ' Whoa :\o. C\'est pour quand une solution à l\'hypothèse de Riemann ?' : '' }`);
    }
}

module.exports = IQCommand;
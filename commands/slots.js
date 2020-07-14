const Command = require("../structures/Command");
const SlotsEmbed = require("../structures/models/embeds/SlotsEmbed");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");

class Slots extends Command {
    constructor(client) {
        super(client, {
            name: "slots",
            category: "economy",
            description: "Joue pour gagner lol",
            usage: "tip slots [bet]",
            aliases: ["s"],
            params: [""]
        });
    }

    async run(message, args, lvl, data) {
        const {channel, author, settings} = message;
        try {
            const {client} = this;
            const {usermanager, config} = client;
            const {id} = author;

            const user = usermanager.getUserById(id);
            let balance = user.getBalance();

            const rawBet = args[0] ? args[0] : '';
            let betStr = rawBet.match(/(\d+)|(^all$)/);
            if (!betStr || !betStr.length) throw new TypeError('Y\'A UNE ERREUR Y\'A UNE ERREUR ALED. En fait non faut juste mettre un argument valide tête de poisson.');
            betStr = betStr[0];
            const bet = /\d+/.test(betStr) ? Number(betStr) : (betStr === 'all' ? balance > 99999 ? 100000 : balance > 0 ? balance : -1 : undefined);
            if (bet > balance || bet < 0) throw new Error('Si t\'es pauvre la commande ne fonctionnera pas, prolo.');
            if (bet > 100000 || bet < 1 || !bet) throw new Error('Déso, 1 peppa min et 100k peppas max.');

            const special = config.special.includes(id);

            let gain = 0;

            const objects = [
                "🍒", "🍒", "🍒", "🍒", "🍒", "🍒", "🍒",
                "🍊", "🍊", "🍊", "🍊", "🍊", "🍊",
                "🍓", "🍓", "🍓", "🍓", "🍓",
                "🍍", "🍍", "🍍", "🍍",
                "🍇", "🍇", "🍇",
                "🍉", "🍉",
                "⭐",
            ];

            const chosen = [];
            for (let i in [1, 2, 3]) {
                chosen.push(objects[Math.floor(Math.random() * objects.length)]);
            }

            const score = new Map();
            for (let i in [1, 2, 3]) {
                if (score.has(chosen[i]) && score.get(chosen[i]) > 0) {
                    let j = score.get(chosen[i]);
                    j++;
                    score.set(chosen[i], j);
                }
                if (!score.has(chosen[i])) {
                    score.set(chosen[i], 1);
                }
            }

            if (chosen.includes("🍒")) {
                if (score.get("🍒") === 2) {
                    gain = Number(Math.ceil(bet * 0.25));
                } else if (score.get("🍒") === 3) {
                    gain = Number(Math.ceil(bet * 3));
                }
            }
            if (chosen.includes("🍊")) {
                if (score.get("🍊") === 2) {
                    gain = Number(Math.ceil(bet * 0.5));
                } else if (score.get("🍊") === 3) {
                    gain = Number(Math.ceil(bet * 5));
                }
            }
            if (chosen.includes("🍓")) {
                if (score.get("🍓") === 2) {
                    gain = Number(Math.ceil(bet * 0.75));
                } else if (score.get("🍓") === 3) {
                    gain = Number(Math.ceil(bet * 7));
                }
            }
            if (chosen.includes("🍍")) {
                if (score.get("🍍") === 2) {
                    gain = Number(Math.ceil(bet));
                }
                if (score.get("🍍") === 3) {
                    gain = Number(Math.ceil(bet * 10));
                }
            }
            if (chosen.includes("🍇")) {
                if (score.get("🍇") === 2) {
                    gain = Number(Math.ceil(bet * 2));
                }
                if (score.get("🍇") === 3) {
                    gain = Number(Math.ceil(bet * 15));
                }
            }
            if (chosen.includes("🍉")) {
                if (score.get("🍉") === 2) {
                    gain = Number(Math.ceil(bet * 3));
                }
                if (score.get("🍉") === 3) {
                    gain = Number(Math.ceil(bet * 25));
                }
            }
            if (chosen.includes("⭐")) {
                if (score.get("⭐") === 2) {
                    gain = Number(Math.ceil(bet * 7));
                }
                if (score.get("⭐") === 3) {
                    gain = Number(Math.ceil(bet * 75));
                }
            }
            console.log(special);

            if (!gain) {
                const _bet = special ? Math.ceil(bet / 2) : bet;
                balance -= _bet;
                user.setBalance(balance);
                usermanager.UpdateUserLocal(id, user);
                await usermanager.UpdateUserAsync(user);
                const embed = new SlotsEmbed(gain, _bet, settings).build(chosen, author, user);
                return await channel.send({embed});
            }

            const _gain = special ? gain * 2 : gain;
            balance += _gain;
            user.setBalance(balance);
            usermanager.UpdateUserLocal(id, user);
            await usermanager.UpdateUserAsync(user);
            const embed = new SlotsEmbed(_gain, bet, settings).build(chosen, author, user);
            return await channel.send({embed});

        } catch (e) {
            const error = new ErrorEmbed(e.message, settings).build();
            return await channel.send({embed: error});
        }

    }
}

module.exports = Slots;
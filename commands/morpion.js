const Command = require("../structures/Command");
const TicTacToe = require("../games/TTT/TicTacToe");
const { getMemberByMixed } = require("../utils/SearchUtils");

class Morpion extends Command {
    constructor(client) {
        super(client, {
            name: "morpion",
            category: "jeux",
            usage: "tip morpion [user]",
            aliases: ["ttt", "tictactoe"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { client } = this;
        const { guild, channel, author } = message;
        const name = args.join(' ');
        const { user } = getMemberByMixed(name, guild);
        if(!user) return;
        if(user === author) return;
        const ticTacToe  = new TicTacToe(client, channel, {po: author, pt: user});
        const game = await ticTacToe.game();
        if(game === -1) {
            return await this.update(undefined, user, author, ticTacToe.name);
        }
        if(game === 1) {
            return await this.update(1, user, author, ticTacToe.name);
        } else {
            return await this.update(game, user, author, ticTacToe.name);
        }
    }

    async update(state, user, author, name) {
        const {client} = this;
        const {gamemanager} = client;
        const stats1 = await gamemanager.getById(author.id);
        stats1.addMatch(name, `${user.id}${state ? state === 1 ? ' WIN' : 'LOOSE' : ''}`);
        const stats2 = await gamemanager.getById(user.id);
        stats2.addMatch(name, `${author.id}${state ? state === 1 ? ' LOOSE' : 'WIN' : ''}`);
        await gamemanager.updateGameStatistics(author.id, stats1);
        await gamemanager.updateGameStatistics(user.id, stats2);
    }
}

module.exports = Morpion;
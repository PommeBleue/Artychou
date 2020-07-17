const { stripIndents } = require("common-tags");
const abc = ['a', 'b', 'c'];

class TicTacToe {
    constructor(client, channel, {po, pt}) {
        this.name = "TicTacToe";
        this.client = client;
        this.channel = channel;
        this.players = [po, pt];
        this.miss = [0, 0];
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.round = 1;
    }

    async game() {
        let message = await this.show();
        while(true) {
            const play = await this.play();
            if(!play) {
                await this.show(message, 0);
                return -1;
            }
            if(play === 'not_valid') {
                continue;
            }
            if(this.win() || this.no_winner()) {
                await this.show(message, true);
                if(this.no_winner()) {
                    await this.show(message, 0);
                    return -1;
                }
                return this.win();
            }
            this.round = this.round === 1 ? 2 : 1;
            message = await this.show(message, false);
        }
    }

    async play() {
        const { players, channel, miss, round } = this;
        if(miss.some(x => x > 4)) return false;
        const player = players[round - 1];
        let response;
        try {
            response = await channel.awaitMessages(msg => msg.author === player, { max: 1, time: 25000, errors: ['time']});
        } catch (e) {
            return false;
        }
        if(!response) return false;
        const { content } = response.first();
        if(content === 'quit' || content === 'stop') return false;
        const regex_one = /({)?x:\d([,;])y:[abcABC](})?$/gm;
        const regex_two = /\d([,;])[abcABC]/gm;
        const match = content.match(regex_one) || content.match(regex_two);
        if(!match) return 'not_valid';
        const chars = match[0].split('');
        const pos = [];
        for(let i in chars) {
            const char = chars[i];
            if(/(\d)|([abcABC])/.test(char)) pos.push(char);
        }
        if(!pos.length || pos.length === 1 || pos.length > 2) return 'not_valid';
        if(pos.some(x => x > 3 || x < 1)) return 'not_valid';
        let x = (Number(pos[0]) - 1) * 3;
        let y = abc.indexOf(pos[1].toLowerCase()) + x;
        this.board[y] = round;
        await response.first().delete();
        return true;
    }
    async show(message, winner) {
        const {players, board, channel, round} = this;
        const symbol = (int) => int === 1 ? 'X' : int === 2 ? 'O' : '?';
        if (!message) {
            return await channel.send(stripIndents`
        ${winner ? `**${players[round - 1].username}** gagne !` : `C'est au tour de : **${players[round - 1].username}**`}
        \`\`\`
        ' +----------+
        1 | ${symbol(board[0])}  ${symbol(board[1])}  ${symbol(board[2])}  | 
        2 | ${symbol(board[3])}  ${symbol(board[4])}  ${symbol(board[5])}  | 
        3 | ${symbol(board[6])}  ${symbol(board[7])}  ${symbol(board[8])}  | 
        ' +----------+
        '   A  B  C  
        ${players[0].username} : X
        ${players[1].username} : O
        \`\`\`
        `)
        }
        return await message.edit(stripIndents`
        ${winner ? `**${players[round - 1].username}** gagne !` : (typeof winner !== 'boolean') ? 'Personne n\'a gagné au fait.' : `C'est au tour de : **${players[round - 1].username}**`}
        \`\`\`
        ' +----------+
        1 | ${symbol(board[0])}  ${symbol(board[1])}  ${symbol(board[2])}  | 
        2 | ${symbol(board[3])}  ${symbol(board[4])}  ${symbol(board[5])}  | 
        3 | ${symbol(board[6])}  ${symbol(board[7])}  ${symbol(board[8])}  | 
        ' +----------+
        '   A  B  C  
        ${players[0].username} : X
        ${players[1].username} : O
        \`\`\`
        `)
    }


    no_winner() {
        const { board } = this;
        return board.every(x => x !== 0) && !(this.win());
    }

    win() {
        if (this.win_by_symbol(1) || this.win_by_symbol(2)) {
            return this.win_by_symbol(1) ? this.win_by_symbol(1) : this.win_by_symbol(2);
        }
        return false;
    }

    win_by_symbol(int) {
        const {board} = this;
        const validation = board;
        if ((validation[0] === int && validation[1] === int && validation[2] === int)
            || (validation[2] === int && validation[5] === int && validation[8] === int)
            || (validation[6] === int && validation[7] === int && validation[8] === int)
            || (validation[0] === int && validation[3] === int && validation[6] === int)
            || (validation[0] === int && validation[4] === int && validation[8] === int)
            || (validation[2] === int && validation[4] === int && validation[6] === int)
            || (validation[1] === int && validation[4] === int && validation[7] === int)
            || (validation[3] === int && validation[4] === int && validation[6] === int)) {
            return int;
        }
        return false;
    }



}

module.exports = TicTacToe;
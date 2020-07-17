const games = ["TicTacToe"];

class GameStats {
    constructor() {
        this.init();
    }

    init() {
        for(let i in games) {
            const game = games[i];
            this[game] = [];
        }
        return this;
    }

    update(object) {
        for(let key in object) {
            if(this[key] === []) continue;
            this[key] = object[key];
        }
        return this;
    }

    getGame(name) {
        return this[name];
    }

    updateGame(name, value) {
        this[name] = value;
        return this;
    }

    addMatch(name, match) {
        if(!this[name]) {
            this[name] = [match];
            return this;
        }
        this[name].push(match);
        return this;
    }
}

module.exports = GameStats;
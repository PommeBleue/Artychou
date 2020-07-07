const DailyResponse = require("../../structures/models/responses/DailyResponse");

class DailyResponses {
    constructor(client) {
        this.client = client;
    }

    respond(user) {
        const {id, daily} = user;
        const special = this.client.config.spacial.includes(id);
        const streak = daily + 1;
        const bonus = this.special ? 2 : 1;
        const base = 200;
        const gain = Math.floor((Math.sqrt(daily) / 10) * base * bonus) + base;
        return new DailyResponse({special, gain, streak});
    }
}

module.exports = DailyResponses;
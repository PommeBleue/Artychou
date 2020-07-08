const DailyResponse = require("../../structures/models/responses/DailyResponse");

class DailyResponses {
    constructor(client) {
        this.client = client;
    }

    respond(user) {
        const {id, daily} = user;
        console.log(id);
        const users = this.client.config["special"];
        const special = users.includes(String(id));
        const streak = daily + 1;
        const bonus = special ? 2 : 1;
        const base = 200;
        const gain = (Math.floor((Math.sqrt(daily) / 10) * base ) + base) * bonus;
        return new DailyResponse({special, gain, streak});
    }
}

module.exports = DailyResponses;
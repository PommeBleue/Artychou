const Enmap = require('enmap');

class Daily {
    constructor(client) {
        this.client = client;
        this.daily = new Enmap({name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }

    newClaimedAt(id) {
        this.daily.set(id, Date.now());
        return this;
    }

    getRemaining(id) {
        if (this.daily.has(id)) {
            const untilNow = Math.abs(Date.now() - this.daily.get(id));
            const remaining = Math.abs(86400000 - untilNow);
            return this.client.func.parseTime(remaining);
        }
        throw new Error();
    }

    check(id) {
        if (this.daily.has(id)) { if (Date.now() - this.daily.get(id) < 172800000) { return (Date.now() - this.daily.get(id)) > 86399999 } else return 'out' };
        return 'no';
    }
}

module.exports = Daily;
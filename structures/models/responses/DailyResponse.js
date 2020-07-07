class DailyResponse {
    constructor(props) {
        this.gain = props["gain"];
        this.streak = props["streak"];
        this.special = props["spacial"];
    }

    isSpecial() {
        return this.special;
    }

    getStreak() {
        return this.streak;
    }

    getGain() {
        this.special;
    }

}

module.exports = DailyResponse;
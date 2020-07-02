class EightBallResponses {
    constructor(client) {
        this.client = client;
    }

    getResponsesInArray(message) {
        const array = [];
        const responses = message.settings["8ball"];
        for(const key in responses) {
            array.push(responses[key]);
        }
        return array;
    }

    getRandomResponse(message) {
        const responses = this.getResponsesInArray(message);
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

module.exports = EightBallResponses;
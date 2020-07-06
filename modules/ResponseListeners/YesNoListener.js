const comparer = require('string-similarity');


class YesNoListener {
    constructor(client) {
        this.client = client;
    }

    async listenAsync(message, question, limit = 15000){
        const func = message.func;
        const response = await func.awaitReplyAsync(message, question, limit);
        if(response) {
            const oui = comparer.compareTwoStrings(response.toLowerCase(), 'oui');
            const non = comparer.compareTwoStrings(response.toLowerCase(), 'non');
            if(oui > 0.5) return true;
            if(non > 0.5) return false;
            return 'response_not_valid';
        }
        return 'error';
    }

}

module.exports = YesNoListener;
const comparer = require('string-similarity');


class OneWordListeners {
    constructor(client) {
        this.client = client;
    }

    async listenAsync(message, word, limit = 15000){
        const func = message.func;
        const response = await func.awaitReplyAsync(message, undefined, limit);
        if(response) {
            const oui = comparer.compareTwoStrings(response.toLowerCase(), word.toLowerCase());
            if(oui > 0.6) return true;
            return false;
        }
        return 'error';
    }

}

module.exports = OneWordListeners;
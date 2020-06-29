const comparer = require('string-similarity');


class YesNoListener {
    constructor(client) {
        this.client = client;
    }

    async listenAsync(message, question){
        const func = message.func;
        const response = await func.awaitReplyAsync(message, question, 15000);
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
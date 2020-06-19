class Retry {
    constructor(client, { toRetry = null, delayMs = 100, maxTries = 5}) {

        this.client = client;
        this.params = {toRetry, delayMs, maxTries};

        this.init();
    }

    init() {
        let params = this.params;
        let tries = 0;
        while(tries < params.maxTries) {
            try {
                return params.toRetry();
            } catch (e) {
                tries ++;
                if(tries >= params.maxTries) {
                    return `Error while executing ${params.toRetry.name} : ${e}`
                }
                this.client.func.delay(params.delayMs).then(params.toRetry());
            }
        }
        return `Error. Please make sure that tries < maxTries.`
    }
}
/**
 *
 */
class Retry {
    constructor(client, toRetry, {delayMs = 100, maxTries = 5}) {

        this.client = client;
        this.toRetry = toRetry;
        this.params = {delayMs, maxTries};

        this.init();
    }

    init() {
        let params = this.params;
        let tries = 0;
        while(tries < params.maxTries) {
            try {
                return this.toRetry();
            } catch (e) {
                tries ++;
                if(tries >= params.maxTries) {
                    return `Error while executing ${this.toRetry.name} : ${e}`
                }
                this.client.func.delayAsync(params.delayMs).then(this.toRetry());
            }
        }
        return `Error. Please make sure that tries < maxTries.`
    }
}
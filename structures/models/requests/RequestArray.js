const Request = require("./Request");
const types = require("../../../utils/types/TypeUtil");

class RequestArray {
    constructor(request) {
        this.requests = request ? request : [];
        this.types = ["REQUEST"];
    }

    addRequest(request) {
        if (request instanceof Request) {
            if(this.requests.includes(request)) return 'Request has already been made.';
            return this.requests.push(request);
        }
        throw new TypeError('request must be an instance of Request');
    }

    removeRequest(request) {
        if (!request instanceof Request) throw new TypeError('request must be an instance of Request');
        const { requests } = this;
        this.requests = requests.filter(e => e !== request);
        return this;
    }

    removeRequestParams(requesting, target) {
        if (!request instanceof Request) throw new TypeError('request must be an instance of Request');
        const { requests } = this;
        this.requests = requests.filter(e => e !== request);
        return this;
    }

    findRequestByType(t) {
        const result = [];
        const {requests} = this;
        if (types.REQUESTS.includes(t)) {
            for (let i = 0; i < requests.length; i++) {
                const request = requests[i];
                const {type} = request;
                if (t === type) result.push(request);
            }
            return result;
        }
        throw new Error('type not valid');
    }

    removeRequests(array) {
        if(!array.every(e => e instanceof Request)) throw new TypeError('every element of the array must be an instance of a Request');
        const { requests } = this;
        this.requests = requests.filter(e => !(array.some(element => element === e)));
        return this;
    }

    getRequests() {
        return this.requests;
    }

    size() {
        return this.requests.length;
    }

}

module.exports = RequestArray;
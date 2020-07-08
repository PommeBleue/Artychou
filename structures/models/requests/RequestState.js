const RequestArray = require("./RequestArray");

class RequestState {
    constructor(type) {
        this.type = type;
        this.requests = new RequestArray();
    }

    getType() {
        return this.type;
    }

    getRequestArray() {
        return this.requests;
    }

}

module.exports = RequestState;
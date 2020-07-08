class Request {
    constructor(type) {
        this.type = type;
        this.state = 'RUNNING';
    }

    configure({requesting, target}) {
        this.requesting = requesting;
        this.target = target;
    }

    getRequesting() {
        return this.requesting;
    }

    getTarget() {
        return this.target();
    }

    getState() {
        return this.state;
    }
}

module.exports = Request;
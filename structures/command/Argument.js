class Argument {
    constructor(client = null, opts = {
        "help": ["help","boolean"],
        "h": "help"
    }) {
        this.opts = opts;
    }

    getType(argument) {
        return this.opts[argument][1];
    }
}


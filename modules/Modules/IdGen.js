const generators = require("id-generators");
const generator = generators.get('nanoid');
const generate = generator({size: 25});

class IdGen {
    constructor(client) {
        this.client = client;
    }

    generate(str) {
        return generate() + '-%1984%-' + str.slice(0, 3);
    }

    ticket(index) {
        return 't-' + generate() + '%1984';
    }
}

module.exports = IdGen;
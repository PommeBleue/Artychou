class ParseOptions {
    constructor(params) {
        this.opts = {};
        this.params = params;
        this.map = new Map();

        this.init();
    }

    init() {
        let array = [];
        let alias = {};
        for (let i = 0, len = this.params.length; i < len; i++) {
            const parameter = this.params[i];
            const keys = Object.keys(parameter);
            if (parameter.spacedString) array.push(parameter.name);
            this.map.set(parameter[keys[0]], i);
            if (parameter.alias && parameter.alias.length) {
                let aliases = [];
                for (let j = 0, len = parameter.alias.length; j < len; j++) {
                    let current = parameter.alias[j];
                    if (current === parameter.alias[j - 1]) continue;
                    aliases.push(current);
                }
                alias[parameter.name] = aliases;
            }
        }
        this.opts.array = array;
        this.opts.alias = alias;
        return this;
    }

    getOptions() {
        return this.opts;
    }

    getIndex(name) {
        if (typeof name !== 'string') return;
        return this.map.get(name);
    }
}

module.exports = ParseOptions;
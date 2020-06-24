const parse = require('yargs-parser');
const ParsedArgument = require('../models/argument/ParsedArgument');
const ParseOptions = require('../models/params/ParseOptions');

class Parse {
    constructor(args, params, message) {
        this.args = args;
        this.params = params;
        this.message = message;


        this.init();
    }

    init() {
        const opts = new ParseOptions(this.params).getOptions();
        const parsedObject = this.parse(opts);
        const parsedArgs = new ParsedArgument();
        let collection = parsedArgs.getCollection();
        let objectValues = parsedArgs.getObjectValues();
        const keys = Object.keys(parsedObject);
        for(let k in keys) {
            const key = keys[k];
            if(key === "_") continue;
        }
        return this;
    }

    parse(opts){
        return parse(this.args, opts);
    }

}
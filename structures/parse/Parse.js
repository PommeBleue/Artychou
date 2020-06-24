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
        const params = this.params;
        if((params.length === 0)){
            if(this.args.length === 0) return {};
            return {".":this.args};
        }
        this.parseOptions = new ParseOptions(params);
        const opts = this.parseOptions.getOptions();
        const parsedObject = this.parse(opts);
        const parsedArgs = new ParsedArgument();
        let collection = parsedArgs.getCollection();
        const keys = Object.keys(parsedObject);
        for(let k in keys) {
            const key = keys[k];
            if(key === "_") continue;
            if(key.length === 1) continue;
            if(Array.isArray(parsedObject[key])){
                collection.set(key, parsedObject[key].join(' '));
                continue;
            }
            collection.set(key, parsedObject[key]);
        }
        parsedArgs.setCollection(collection);
        parsedArgs.setObjectValues({
            guild: this.message.channel.guild,
            channel: this.message.channel,
            member: this.message.member,
            user: this.message.user
        });
        this.parsedArgs = parsedArgs;
        return this;
    }

    fetch(){
        const params = this.params;
        const collection = this.parsedArgs.getCollection();
        const objectValues = this.parsedArgs.getObjectValues()
        let argData = {};
        for(const key in params){
            let current = params[key];
            if(current.iParse && typeof current.iParse === 'function'){
                const { iParse } = current;
                try {
                    argData[current.name] = iParse({input: collection.get(current.name), ov: objectValues});
                } catch (e) {
                    throw e;
                }
            } else {
                argData[current.name] = collection.get(current.name);
            }
        }
        return argData;
    }

    verify(){
        const params = this.params;
        const collection = this.parsedArgs.getCollection();
        for(const key in params){
            let current = params[key];
            if(current.optional) {
                if(current.requires) {
                    for(let i=0, len=current.requires.length; i<len; i++){
                        if(collection.has(params[current.requires[i]].name)) {
                            continue;
                        } else {
                            throw new Error(`${current.name} requires ${params[current.requires[i]]}`);
                        }
                    }
                } else {
                    continue;
                }
            } else {
                if(!(collection.has(current.name))) throw new Error(`${current.name} is required`);
            }
        }
    }

    parse(opts){
        return parse(this.args, opts);
    }

}
const parse = require('yargs-parser');
const ErrorEmbed = require('../models/embeds/ErrorEmebed');
const ParsedArgument = require('../models/argument/ParsedArgument');
const ParseOptions = require('../models/params/ParseOptions');

class Parse {
    constructor(args, params, message) {
        this.args = args;
        this.params = params;
        this.message = message;
    }

    init() {
        const params = this.params;
        if (params.length === 0) {
            if (this.args.length === 0) return {};
            return {".": this.args};
        }
        this.parseOptions = new ParseOptions(params);
        const opts = this.parseOptions.getOptions();
        const parsedObject = this.parse(opts);
        const parsedArgs = new ParsedArgument();
        this.mov = parsedArgs.setObjectValues({
            guild: this.message.channel.guild,
            channel: this.message.channel,
            member: this.message.member,
            user: this.message.author
        }).objectValues;
        //console.log(parsedObject);
        let collection = parsedArgs.getCollection();
        const keys = Object.keys(parsedObject);
        let passed = false;
        // TODO : if there is no option passed, fetch default.
        if (keys.length === 1 && keys[0] === "_") {
            return {default: this};
        }
        if (!passed) {
            for (let k in keys) {
                const key = keys[k];
                if (key === "_") continue;
                if (key.length === 1) continue;
                if (Array.isArray(parsedObject[key])) {
                    if (parsedObject[key].length === 0) {
                        if (!(this.params[this.parseOptions.map.get(key)].type.some(e => e === "boolean"))) return 'Object Error'
                        // TODO : Error class to send an object that details the error
                        collection.set(key, true);
                    }
                    collection.set(key, parsedObject[key].join(' '));
                    continue;
                }
                collection.set(key, parsedObject[key]);
            }
        }
        parsedArgs.setCollection(collection);
        this.parsedArgs = parsedArgs;
        return this;
    }

    fetch() {
        const channel = this.message.channel;
        const params = this.params;
        const collection = this.parsedArgs.getCollection();
        const objectValues = this.parsedArgs.getObjectValues();
        let argData = {};
        for (const key in params) {
            let current = params[key];
            if (current.iParse && typeof current.iParse === 'function') {
                const {iParse} = current;
                if (!(collection.has(current.name))) continue;
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

    defaultFetch(defaultFetch) {
        const channel = this.message.channel;
        const argDefaultData = {};
        const objectValues = this.mov;
        argDefaultData["default"] = defaultFetch({str: this.args.join(''), mov: objectValues});
        if (!argDefaultData["default"]) return 'Error';
        return argDefaultData;
    }

    verify() {
        const channel = this.message.channel;
        const params = this.params;
        const collection = this.parsedArgs.getCollection();
        //console.log(this.parsedArgs);
        for (const key in params) {
            let current = params[key];
            if (current.regexType && typeof current.regexType === 'function') {
                const value = collection.get(current.name);
                const testValue = typeof value !== 'string' ? String(value) : value;
                if (!(current.regexType(testValue))) {
                    const error = new ErrorEmbed(`Not a valid type for **${current.name}**. Consider reading usage for this command, Bitch.`, this.message.settings).build();
                    (async () => await channel.send({embed: error}))();
                    return this.message.logger.error(`${current.name} does not match the type **${current.type.join(' or ')}**`);
                }
            }
            if (current.optional) {
                if (current.requires) {
                    if (!(collection.has(current.name))) continue;
                    for (let i = 0, len = current.requires.length; i < len; i++) {
                        if (collection.has(params[current.requires[i]].name)) {
                            continue;
                        } else {
                            const error = new ErrorEmbed(`${current.name} requires ${params[current.requires[i]].name}`, this.message.settings).build();
                            (async () => {
                                await channel.send({embed: error})
                            })();
                            return this.message.logger.error(`${current.name} requires ${params[current.requires[i]].name}`);
                        }
                    }
                } else {
                    continue;
                }
            } else {
                if (!(collection.has(current.name))) {
                    const error = new ErrorEmbed(`${current.name} is required`, this.message.settings).build();
                    (async () => {
                        await channel.send({embed: error})
                    })();
                    return this.message.logger.error(`${current.name} is required`);
                }
            }
        }
        return true;
    }

    parse(opts) {
        return parse(this.args, opts);
    }

}

module.exports = Parse;
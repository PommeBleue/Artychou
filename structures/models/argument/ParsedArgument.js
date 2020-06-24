const { Collection } = require('discord.js');

class ParsedArgument {
    constructor() {
        this.collection = new Collection();
        this.objectValues = {};
    }

    setObjectValues(o){
        this.objectValues = o;
        return this;
    }

    setCollection(collection){
        this.collection = collection;
        return this;
    }

    getCollection() {
        return this.collection;
    }

    getObjectValues(){
        return this.objectValues;
    }

}

module.exports = ParsedArgument;
class Argument {
    constructor(client = null, opts = {
        "help": ["help","boolean"],
        "aliases": ['h']
    }) {
        this.opts = opts;
    }

    getType(argument) {
        return this.opts[argument][1];
    }

    getAliases(){
        let array = [];
        for(const key in this.opts){
            if(key.length === 1) array.push(key);
        }
    }

}

module.exports = Argument;


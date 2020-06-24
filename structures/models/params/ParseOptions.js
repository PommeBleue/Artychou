class ParseOptions {
    constructor(params) {
        this.opts = {};
        this.params = params;

        this.init();
    }

    init(){
        let array = [];
        let alias = {};
        for(let i=0, len=this.params.length; i<len; i++){
            const parameter = this.params[i];
            const keys = Object.keys(parameter);
            if(parameter.spacedString) array.push(parameter.name);
            for(let k in keys){
                const key = keys[k];
                const value = parameter[key];

                if(value.alias && value.alias.length) {
                    let aliases = [];
                    for(let j=0, len=value.alias.length; j<len; j++){
                        let current = value.alias[j];
                        if(current === value.alias[j-1]) continue;
                        aliases.push(current);
                    }
                    alias[value.name] = aliases;
                }
            }
        }
        this.opts.array= array;
        this.opts.alias= alias;
        return this;
    }

    getOptions(){
        return this.opts;
    }
}

module.exports = ParseOptions;
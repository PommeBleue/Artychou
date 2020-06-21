const { Collection } = require('discord.js');

module.exports = class InternalPackages {
    constructor(client){
        this.client = client;
        this.structures = ["structures", {
            command: { argument: "test" },
            embed: { embedbuilder: "test2" }

        }]
        this.packagesMap = new Collection();
    }

    init() {
        this.getPackagesInStructures();
    }


    getPackagesInStructures(){
        for(let k in Object.keys(this.structures[1])) {
            let key = Object.keys(this.structures[1])[k];
            let element = this.structures[1][key];
            if(element instanceof Object) {
                for(let k2 in Object.keys(element)) {
                    let key2 = Object.keys(element)[k2]
                    this.VerifyKeyInObject(element[key2], key2);
                }
            } else {
                this.packagesMap.set(key, element);
            }
        }
    }

    VerifyKeyInObject(element, key) {
        if(element instanceof Object) {
            for(let k in Object.keys(element)) {
                let key = Object.keys(element)[k]
                let newElement = element[key];
                this.VerifyKeyInObject(newElement, key);
            }
        } else {
            this.packagesMap.set(key, element);
        }
    }
}
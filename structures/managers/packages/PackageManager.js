const path = require("path");

class InternalPackages {
    constructor(client){
        this.client = client;
        this.structures = ["structures", {
            Listeners: { argument: "ThreeMListener", word: "AnotherWordListener" }
        }];

        this.packages = {};

        this.currentForLoop = 0;
        this.currentDirectory = [];
        this.directories = [];
    }

    init() {
        this.getPackagesInStructures();
        return this;
    }

    get(name){
        let module = this.packages[name];
        if(!module) return;
        return module;
    }


    reverseSlice(int, array) {
        return array.reverse().slice(array.length - int );
    }

    getPackagesInStructures() {
        let dir;
        for(let k in Object.keys(this.structures[1])) {
            let key = Object.keys(this.structures[1])[k];
            this.currentForLoop = 0;
            this.currentDirectory = [];
            this.currentDirectory.push(key);
            let element = this.structures[1][key];
            if(element instanceof Object) {
                this.currentForLoop++;
                for(let k2 in Object.keys(element)) {
                    let key2 = Object.keys(element)[k2];
                    this.currentDirectory = this.reverseSlice(this.currentForLoop, this.currentDirectory).reverse();
                    this.currentDirectory.push(key2);
                    this.VerifyKeyInObject(element[key2]);
                }
            } else {
                this.currentDirectory.push(element);
                dir = this.currentDirectory.join(path.sep)
                this.directories.push(dir);
                let obj = require(`../../../modules/${dir}`);
                this.packages[element] = new obj(this.client);
            }
        }
    }

    VerifyKeyInObject(element) {
        let dir;
        if(element instanceof Object) {
            this.currentForLoop++;
            for(let k in Object.keys(element)) {
                let key = Object.keys(element)[k];
                this.currentDirectory = this.reverseSlice(this.currentForLoop, this.currentDirectory).reverse();
                this.currentDirectory.push(key);
                let newElement = element[key];
                this.VerifyKeyInObject(newElement, key);
            }
            this.currentForLoop = this.currentForLoop - 1;
        } else {
            this.currentDirectory.pop();
            this.currentDirectory.push(element);
            dir = this.currentDirectory.join(path.sep);
            this.directories.push(dir);
            let obj = require(`../../../modules/${dir}`);
            this.packages[element] = new obj(this.client);
        }
    }
}

module.exports = InternalPackages;
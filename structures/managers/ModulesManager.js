const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

class ModulesManager {
    constructor(client) {
        this.client = client;
        this.modules = new Collection();
    }

    init() {
        this.load();
        return this;
    }

    module(module) {
        if(!this.modules.has(module)) throw new Error();
        return this.modules.get(module);
    }

    load() {
        const dir = this.client.config.dir;
        const paths = path.join(dir, "modules", "Modules");
        fs.readdir(paths, (err, files) => {
           files.forEach(file => {
                const name = path.parse(file)["name"];
                this.client.logger.event(`Loading module [${name}]`);
                const module = new (require(path.join(paths, name)))(this.client);
                this.modules.set(name, module);
           });
        });
    }
}

module.exports = ModulesManager;
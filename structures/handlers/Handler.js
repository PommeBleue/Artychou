const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");
const fs = require("fs");


/**
 * @requires klaw, fs, path, Collection
 * @type {ArtychouHandler}
 * @description Main handler that stores all the commands handles them. Handles the events also.
 * @function init
 * @function loadCommand
 * @function unloadCommand
 */
module.exports = class ArtychouHandler {
    constructor(client) {
        this.commands = new Collection();
        this.aliases = new Collection();

        this.client = client;
    }

    init = async () => {
        klaw(path.join(this.client.config.dir, "commands")).on("data", (item) => {
            const cmdFile = path.parse(item.path);
            if(!cmdFile || cmdFile.ext !== ".js") return;
            console.log(cmdFile.name);
            const response = this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
            if(response) this.client.logger.error(response);
        });

        fs.readdir(path.join(this.client.config.dir, "events"), (err, files) => {
           files.forEach(file => {
               const evtName = file.split(".")[0];
               this.client.logger.log(`Loading Event ${evtName}`);
               const event = new (require(path.join(this.client.config.dir, "events", file)))(this.client);
               //Cette ligne de code est géniale, je dis ça je dis rien.
               this.client.on(evtName, (...args) => event.run(...args));
               delete require.cache[require.resolve(path.join(this.client.config.dir, "events", file))];
           });
        });

        await this.client.login(this.client.config.token);

    }

    loadCommand(cPath, cName){
        try {
            const props = new (require(`${cPath}${path.sep}${cName}`))(this.client);
            this.client.logger.log(`Chargement de la commande ${props.help.name}`);
            props.conf.location = cPath;
            if(props.init) {
                props.init(this.client);
            }
            this.commands.set(props.name, props);
            for(let i = 0; i < props.conf.aliases.length; i++) {
                this.aliases.set(props.conf.aliases[i], props);
            }
            return false;
        } catch (e) {
            return `Je n'arrive pas à charger la commande ${cName} : ${e}`
        }
    }

    async unloadCommand(cPath, cName) {
        let command;
        if(this.commands.has(cName)) {
            command = this.commands.get(cName);
        } else if (this.aliases.has(cName)) {
            command = this.aliases.get(cName);
        }
        if(!command) return `Il semble que la commande ${cName} n'existe pas, ou bien n'est pas mise dans le bon dossier.`

        delete require.cache[require.resolve(`${cPath}${path.sep}${cName}.js`)];
        return false;
    }
};
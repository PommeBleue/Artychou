if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const { Client } = require("discord.js");
const { ExternalPackages } =  require("");
const Handler = require('./structures/handlers/Handler');
const SettingsHandler = require('./structures/handlers/SettingsHandler');
const r = require("rethinkdbdash")();

class Artychou extends Client {
    constructor(options) {
        super(options);

        this.external = new ExternalPackages();

        this.func = require("./utils/UtilFunctions");

        this.config = require("./config");

        this.wait = require("util").promisify(setTimeout);

        this.dbObjects = {
            artychoudb: r.db('artychou')
        };

        this.dbHandler = new UserHandler(this);

        this.logger = require('./modules/Logger');

        this.settingsh = new SettingsHandler();
        this.handler = new Handler(this);
    }
}

const client = new Artychou();


client.on('ready', () => {
});

client.handler.init().then();
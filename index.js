if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const { Client } = require("discord.js");
//const { ExternalPackages, InternalPackages } =  require("./structures/managers/packages/PackageManager.js");
const Handler = require('./structures/handlers/Handler');
const SettingsHandler = require("./structures/handlers/SettingsHandler")
const DataBaseService = require("./database/DataBaseService");
const UserManager = require("./structures/managers/UserManager");

class Artychou extends Client {
    constructor(options) {
        super(options);

        //this.external = new ExternalPackages();

        //this.internal = new InternalPackages();

        this.dbService = new DataBaseService(this).init();

        this.usermanager = new UserManager(this).init();

        this.func = require("./utils/UtilFunctions");

        this.config = require("./config");

        this.logger = require('./modules/Logger');

        this.settingsh = new SettingsHandler();
        this.handler = new Handler(this);
    }
}

const client = new Artychou({
    presence: {
        status: "dnd",
        activity: {
            name: "fracasser Yuuki",
            type: 0
        }
    }
});


client.on('ready', () => {
    client.logger.log(`${client.user.username} is ready, bitch.`, "ready");
});

client.handler.init().then();
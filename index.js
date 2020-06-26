if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const { Client, Collection } = require("discord.js");
const InternalPackages = require("./structures/managers/packages/PackageManager");
const Handler = require('./structures/handlers/Handler');
const SettingsHandler = require("./structures/handlers/SettingsHandler")
const DataBaseService = require("./database/DataBaseService");
const UserManager = require("./structures/managers/UserManager");

class Artychou extends Client {
    constructor(options) {
        super(options);

        this.logger = require('./modules/Logger');

        //this.external = new ExternalPackages();

        this.internal = new InternalPackages(this).init();

        this.dbService = new DataBaseService(this).init();

        this.usermanager = new UserManager(this).init();

        this.Ilisteners = {
            tml: this.internal.get("ThreeMListener"),
            awl: this.internal.get("AnotherWordListener")
        };

        this.func = require("./utils/UtilFunctions");

        this.config = require("./config");

        this.handler = new Handler(this);
        this.settingsHandler = new SettingsHandler(this);
    }

    async init() {
        this.handler = await this.handler.init();
        this.settingsHandler = await this.settingsHandler.init();
        return this;
    }
}

const client = new Artychou({
    presence: {
        activity: {
            name: "fracasser Yuuki",
            type: 0
        }
    }
});

client.login(client.config.token);

client.on('ready', async () => {
    await client.init();
    client.logger.log('Artychou is ready, bitch.', "ready");
});

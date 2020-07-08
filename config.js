const { config } = require('dotenv');

config({
    path: __dirname + "/.env"
});

let ArtychouConfig;
ArtychouConfig = {

    "prefixes": ["tip", "artychou.", "t-"],

    "owner": "479332968242872323",

    "admins": ["390071894226894850", "397492826125893633", "569205521903648780", "470136226381561867"],

    "developers": ["479332968242872323"],

    "special": ["390071894226894850", "397492826125893633", "479332968242872323"],

    "token": process.env.TOKEN,

    "defaultSettings": {
        "prefix": "tip",
        "modLogChannel": "mod",
        "modRole": "Mod",
        "adminRole": "Admin",
        "systemNotice": true,
        "welcomeEnabled": false,
        "welcomeChannel": "général",
        "welcomeMessage": "Dites bonjour à {{user}}, les salopes ! Et n'oubliez pas, faut qu'elle (ou il) devienne fou avant de quitter le serveur :D",
    },

    permLevels: [
        {
            level: 0,
            name: "User",
            check: () => true
        },

        {
            level: 2,
            name: "Mod",
            check: (message) => {
                try {
                    const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
                    if (modRole && message.member.roles.cache.has(modRole.id)) return true;
                } catch (e) {
                    return false;
                }
            }
        },

        {
            level: 3,
            name: "Admin",
            check: (message) => {
                try {
                    const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
                    return (adminRole && message.member.roles.cache.has(adminRole.id));
                } catch (e) {
                    return false;
                }
            }
        },

        {
            level: 4,
            name: "Server Owner",
            check: (message) => message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id) : false
        },

        {
            level: 7,
            name: "Bot Developer",
            check: (message) => ArtychouConfig.developers.includes(message.author.id)
        },

        {
            level: 8,
            name: "Bot Admin",
            check: (message) => ArtychouConfig.admins.includes(message.author.id)
        },

        {
            level: 9,
            name: "Special Members",
            check: (message) => ArtychouConfig.special.includes(message.author.id)
        },

        {
            level: 10,
            name: "Bot Owner",
            check: (message) => ArtychouConfig.owner === message.author.id
        }
    ],


    dir: "/Users/mac/WebstormProjects/artychou2",

    apis: {
        genius: {
            token : process.env.GENIUSTOKEN,
            apiUrl: 'https://api.genius.com/search?q='
        },
        iss: {
            token: null,
            apiUrl : 'http://api.open-notify.org/iss-now.json'
        }
    }

};

module.exports = ArtychouConfig;
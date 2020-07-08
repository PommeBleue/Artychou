const Discord = require("discord.js");


module.exports.USER = Discord.User;

module.exports.GUILD = Discord.Guild;

module.exports.MEMBER = Discord.GuildMember;

module.exports.REQUESTS = ["TEAM_TEAM_ALLY", "TEAM_USER_INVITE", "USER_TEAM_JOIN"];

module.exports.REQUESTSATES = ["REQUESTING", "TARGET"];
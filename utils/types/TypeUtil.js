const Discord = require("discord.js");


module.exports.USER = Discord.User;

module.exports.GUILD = Discord.Guild;

module.exports.MEMBER = Discord.GuildMember;

module.exports.REQUESTS = ["TEAM_TEAM_ALLY", "TEAM_USER_INVITE", "USER_TEAM_JOIN"];

module.exports.REQUESTSATES = ["REQUESTING", "TARGET"];

module.exports.MONTHS = [
    ['January', 'Janvier', 'janvier'],
    ['February','Fevrier', 'février'],
    ['March', 'Mars', 'mars'],
    ['April', 'Avril', 'avril'],
    ['May', 'Mai', 'mai'],
    ['June', 'Juin', 'juin'],
    ['July', 'Juillet', 'juillet'],
    ['August', 'Aout', 'août'],
    ['September', 'Septembre', 'septembre'],
    ['October', 'Octobre', 'octobre'],
    ['November', 'Novembre', 'novembre'],
    ['December', 'Decembre', 'décembre']];

module.exports.FACTS =  ["dog", "cat", "koala", "panda", "fox", "bird"];
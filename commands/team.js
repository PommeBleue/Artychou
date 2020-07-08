const Command = require("../structures/Command");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const { getMemberByMixed } = require("../utils/SearchUtils");
const SuccessEmbed = require("../structures/models/embeds/SuccessEmbed");
const s = require("underscore.string");

class TeamCommand extends Command {
    constructor(client) {
        super(client, {
            name: "team",
            description: "Lets you manage your team if your are a leader, or show information about it.",
            category: "teams",
            guildOnly: true,
            aliases: ["t"],
            params: []
        });
    }

    async run(message, args, lvl, data) {
        const { channel, guild, author, settings } = message;
        const  { id } = author;
        const { usermanager, teamanger, requestManager } = this.client;
        const user = usermanager.getUserById(id);
        const team = user.getTeam();
        if(team === null || !team) {
            const error = new ErrorEmbed('Tu n\'a pas de team clodo.', settings).build();
            return await channel.send({embed: error});
        }
        if(args.length) {
            switch (args[0]) {
                case 'leave':
                    if(id === team.getTeamLeader()) {
                        const error = new ErrorEmbed('Tu ne peux pas quitter ta team en étant leader, tu dois transférer la propriété d\'abord', settings).build();
                        return await channel.send({embed: error});
                    }
                    team.removeUser(id);
                    user.leaveTeam();
                    teamanger.UpdateTeamLocal(team);
                    await teamanger.UpdateTeamAsync(team);
                    usermanager.UpdateUserLocal(id, user);
                    await usermanager.UpdateUserAsync(user);
                    const embed = new SuccessEmbed(`Successfully leaved ${team.getName()}. Guess they were not as good as you thought they would be => 🚮. `, settings).build();
                    return await channel.send({embed});
                case 'info':
                    break;
                case 'invite':
                    const name = args.slice(1).join(' ');
                    const member = getMemberByMixed(name, guild);
                    const userId = member["id"];
                    const teamId = team.getId();
                    const request = requestManager.createNewRequest({requesting: teamId, target: userId}, 'TEAM_USER_INVITE');
                    if(typeof request === 'string') {
                        const error = new ErrorEmbed(`You've already invited ${s.capitalize(name, true)} to your team.`, settings).build();
                        return await channel.send({embed: error});
                    }
                    const success = new SuccessEmbed(`Successfully invited ${user["username"]} to your team. Wait for him to accept or to decline if your team is too merdique.`, settings).build();
                    return await channel.send({embed: success});
                case 'description':
                    break;
                case 'name':
                    break;
                case 'slogan':
                    break;
                case 'bank':
                    break;
                case 'color':
                    break;
                case 'thumbnail':
                    break;
                case 'members':
                    break;
                default:

            }
        }

    }
}

module.exports = TeamCommand;
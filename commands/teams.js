const Command = require("../structures/Command");
const Team = require("../structures/models/team/Team");
const ErrorEmbed = require("../structures/models/embeds/ErrorEmebed");
const SuccessEmbed = require("../structures/models/embeds/SuccessEmbed");
const TeamsEmbed = require("../structures/models/embeds/TeamsEmbed");

class TeamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "teams",
            description: "Base command for teams.",
            category: "teams",
            usage: "tip teams [action] [arguments]",
            guildOnly: true,
            aliases: ["ts"],
            params: []
        });

        this.examples = ["`tip teams create MyTeam The description of MyTeam` (Crée une team avec la description : The descritpion of My Team)\n Attention ! Le nom de votre team doit figurer juste après le create et avoir au moins 3 caractères.", "`tip teams show Sou` Vous montre la team de Sou, si elle en a."];
    }

    async run(message, args, lvl, data) {
        const { author, channel, guild, settings } = message;
        const { id, username } = author;
        const { teamanger, handler, usermanager, requestManager } = this.client;
        const user = usermanager.getUserById(id);
        if(args.length) {
            switch (args[0]) {
                case 'create':
                    if(teamanger.hasTeam(id)) {
                        const error = new ErrorEmbed('Tu es déjà dans une team. Tu dois d\'abord la quitter en faisant `tip team leave` si tu veux en créer une nouvelle.', settings).build();
                        return await channel.send({embed: error});
                    }
                    const name = args[1];
                    const description = args.slice(2).join(' ');
                    const team = await teamanger.CreateNewTeamAsync(name, description, id);
                    if(typeof team === 'string') {
                        let em  = String();
                        switch (team) {
                            case "error":
                                em = "Veullez réeassyer, si le problème persiste, parlez-en aux trois créateurs.";
                                break;
                            case "not valid name":
                                em = "Le nom de votre team doit être d'au moins 3 caractères et ne doit pas dépasser 16 caractères.";
                                break;
                            default:
                                em = "Veullez réeassyer, si le problème persiste, parlez-en aux trois créateurs.";
                        }
                        const error = new ErrorEmbed(em, settings).build();
                        return await channel.send({embed: error});
                    }
                    const success = new SuccessEmbed(`Yes ! Votre team du nom de ${name} vient d'être créee ! Vous pouvez toujours le changer, puisque c'est quand même pourris comme nom ce que vous avez mis. Pour ce faire : \`tip team name [name]\`. Maintenant vous pouvez disposer.`, settings).build();
                    return await channel.send({embed: success});
                case 'show':

                    break;
                case 'leading':
                    console.log(args[0]);
                    break;
                case 'join':
                    if(teamanger.hasTeam(id)) {
                        const error = new ErrorEmbed('Tu es déjà déans une team, tu ne peux donc ni recevoir d\'invitations, ni créer une team. Il te reste toujours l\'option de quitter ta team en faisant : \`tip team leave\`', settings).build();
                        return await channel.send({embed: error});
                    }
                    const state = requestManager.getRequestState(id, 'REQUESTING');
                    const target = requestManager.getArray(state, true);
                    const request = target.findRequestByType('TEAM_USER_INVITE');
                    if(request.length) {
                        if(request.length === 1) {
                            const r = request[0];
                            const team = teamanger.getTeamById(r.requesting);
                            team.addUser(id);
                            teamanger.UpdateTeamLocal(team);
                            await teamanger.UpdateTeamAsync(team);
                            user.setTeam(team);
                            usermanager.UpdateUserLocal(id, user);
                            await usermanager.UpdateUserAsync(user);
                            target.removeRequest(r);
                            requestManager.setRequestState(id, state, 'TARGET');
                            const success = new SuccessEmbed(`Successfully joined ${team.getName()}`, settings);
                            return await channel.send({embed: success});
                        }
                    }
                    break;
                default:
                    console.log('default');
            }
        }
        const requesting = requestManager.getArray(requestManager.getRequestState(id, "REQUESTING"), true);
        const target = requestManager.getArray(requestManager.getRequestState(id, 'TARGET'), true);
        const embed = new TeamsEmbed(teamanger, settings).build(requesting, target);
        return await channel.send({embed});
    }

}

module.exports = TeamsCommand;
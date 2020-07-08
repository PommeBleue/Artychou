const EmbedBuilder = require("../../embed/EmbedBuilder");

class TeamsEmbed extends EmbedBuilder {
    constructor(manager, settings) {
        super();
        this.manager = manager;
        this.title = settings["titles"]["teams_title"];
        this.description = settings["messages"]["teams_message"];
        this.color = settings["colors"]["blue_color"];
    }

    build(requesting, target) {
        const { manager } = this;
        const safeReq = requesting.findRequestByType('USER_TEAM_JOIN');
        if(safeReq.length) {
            const req = safeReq.map(e => {
                const id = e.target;
                const team = manager.getTeamById(id);
                return `\`${team.getName()}\``;
            });
            this.addField('requesting', req.json('\n'));
        }
        const safeTar = target.findRequestByType('TEAM_USER_INVITE');
        if(safeTar.length) {
            const tar = safeTar.map(e => {
                const id = e.requesting;
                const team = manager.getTeamById(id);
                return `\`${team.getName()}\``;
            });
            this.addField('invited to', tar.join('\n'));
        }
        return this;
    }
}

module.exports = TeamsEmbed;
const { Collection } = require("discord.js");
const Team = require("../models/team/Team");

class TeamsManager {
    constructor(client) {
        this.client = client;
        this.type = "teams";

        this.teams = new Collection();
        this.users = this.client.usermanager;
    }

    async init() {
        const type = this.type;
        this.table = await this.client.dbService.getTableAsync(type);
        this.loadTeams();
        return this;
    }

    loadTeams() {
        const table = this.table;
        for(const key in table) {
            const t = table[key];
            const team = new Team(t.id, t.name)
                .setBalance(t.balance)
                .setColor(t.color)
                .setPower(t.power)
                .setSlogan(t.slogan)
                .setTeamSongs(t.songs)
                .setUsers(this.loadUsersObjects(t.users))
                .setUsersWhoClaimed(t.claimed)
                .setThumbnail(t.thumbnail);
            this.teams.set(team.id, team);
        }
    }

    loadUsersObjects(users) {
        const array = [];
        for(let i = 0; i < users.length; i++) array.push(this.users.getUserById(users[i]));
    }

    getTeamById(id) {
        const team = this.teams.get(id);
        if(!id) throw new Error();
        return team;
    }

    UpdateTeamLocal(team) {
        if(!(team instanceof Team)) throw new TypeError('team has to be instance of Team');
        this.teams.set(team.id, id);
        return this;
    }

    async UpdateTeamAsync() {

    }

    async CreateNewTeamAsync(name, description = 'A team.') {

    }

}

module.exports = TeamsManager;
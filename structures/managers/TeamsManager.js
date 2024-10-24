const { Collection } = require("discord.js");
const Team = require("../models/team/Team");
const User = require("../models/user/User");

class TeamsManager {
    constructor(client) {
        this.client = client;
        this.type = "teams";

        this.teams = new Collection();
    }

    async init() {
        const type = this.type;
        this.table = await this.client.dbService.getTableAsync(type);
        this.loadTeams();
        console.log(this.teams);
        return this;
    }

    loadTeams() {
        const table = this.table;
        const { usermanager } = this.client;
        for(const key in table) {
            const t = table[key];
            const team = new Team(t.id, t.name)
                .setBalance(t.balance)
                .setColor(t.color)
                .setSlogan(t.slogan)
                .setTeamSongs(t.songs)
                .setUsers(t.users)
                .setTeamLeader(t.leader)
                .setAchievements(t.acheivements)
                .setUsersWhoClaimed(t.claimed)
                .setTeamEnemies(t.enemy)
                .setTeamAllies(t.ally)
                .setThumbnail(t.thumbnail);
            this.teams.set(team.id, team);
            const { users } = team;
            for( let i = 0; i < users.length; i ++) usermanager.getUserById(users[i]).setTeam(team);
        }
        console.log(usermanager.users);
    }

    getTeamPower(team) {
        if(!team instanceof Team) throw new TypeError('team has to be instance of Team');
        const { usermanager } = this.client;
        const { users } = team;
        let power = 0;
        for(let i = 0, len = users.length; i < len; i ++) {
            const id = users[i];
            const user = usermanager.getUserById(id);
            const p = Math.floor(Math.sqrt(user.getBalance() / 1000) / 10);
            power += p;
        }
        return power;
    }

    getTwoTeamsPower(team1, team2){
        const power1 = this.getTeamPower(team1);
        const power2 = this.getTeamPower(team2);
        return power1 > power2;
    }

    hasTeam(userId) {
        const keys = this.teams.keyArray();
        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const current = this.teams.get(key);
            if(current.users.includes(userId)) return true;
        }
        return false;
    }

    loadUsersObjects(users) {
        const array = [];
        for(let i = 0; i < users.length; i++) array.push(this.users.getUserById(users[i]));
        return array;
    }

    getTeamById(id) {
        const team = this.teams.get(id);
        if(!team) throw new Error();
        return team;
    }

    getTeamByName(name){
        if(name.length > 2 && name.length < 17) {
            this.teams.forEach((team, id) => {
               if( name  === team.getName()) return {id, team};
            });
            return undefined;
        }
    }

    getTeamByMixed(id) {
        if(!this.teams.has(id)) return undefined;
        let team = this.getTeamByName(id);
        if(!team) return undefined;
        return this.getTeamById(id);
    }

    UpdateTeamLocal(team) {
        if(!(team instanceof Team)) throw new TypeError('team has to be instance of Team');
        const  { id } = team;
        this.teams.set(id, team);
        return this;
    }

    async UpdateTeamAsync(team) {
        if(!(team instanceof Team)) throw new TypeError('team has to be instance of Team');
        const { dbService } = this.client;
        await dbService.UpdateInTableAsync(this.type, team);
        return this;
    }

    async CreateNewTeamAsync(name, description, leader) {
        if(name.length < 3 || name.length > 32) return 'not valid name';
        const { modules, dbService, usermanager } = this.client;
        const id = modules.module('IdGen').generate(name);
        const safeId = (String(leader).match(/\d+/));
        if(safeId === null) return 'error';
        const team = new Team(id, name).setDescription(description).setTeamLeader(safeId[0]).addUser(safeId[0]);
        this.teams.set(id, team);
        usermanager.getUserById(leader).setTeam(team);
        await dbService.AddInTableAsync(this.type, team);
        return team;
    }

}

module.exports = TeamsManager;
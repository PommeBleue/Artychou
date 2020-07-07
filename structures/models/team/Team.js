const util = require("../../../utils/SearchUtils");

class Team {
    constructor(id, name) {

        this.name = name;

        this.id = id;

        this.users = [];

        this.description = "A team.";

        this.leader = "0";

        this.songs = [];

        this.acheivements = [];

        this.power = 0;

        this.enemy = [];

        this.ally = [];

        this.color = "#eea3f7";

        this.thumbnail = "https://www.cned.fr/media/css/commun/header_logoCned.png?2018.04.13"

        this.slogan = "Philosophiae Naturalis Principia Mathematica";

        this.balance = 0;

        this.claimed = [];

    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getUsers() {
        return this.users;
    }

    getTeamLeader() {
        return (this.leader.match(/\d+/) || [])[0];
    }

    getTeamSongs() {
        return this.songs;
    }

    getAchievements() {
        return this.acheivements;
    }


    getPower() {
        return this.power;
    }

    getTeamEnemy() {
        return this.enemy;
    }

    getTeamAlly() {
        return this.ally;
    }

    getColor() {
        return this.color;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    getSlogan() {
        return this.slogan;
    }

    getBalance() {
        return this.balance;
    }

    getUsersWhoClaimed() {
        return this.claimed;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setUsers(array) {
        this.users = array;
        return this;
    }

    setTeamLeader(id) {
        this.leader = (id.match(/\d+/) || [])[0];
        return this;
    }

    setTeamSongs(array) {
        this.songs = array;
        return this;
    }

    addAchievement(a) {
        this.acheivements.push(a);
        return this;
    }

    setPower(power) {
        this.power = power;
        return this;
    }

    addTeamEnemy(enemy) {
        this.enemy.push(enemy);
        return this;
    }

    removeTeamEnemy(id) {
        this.enemy = this.enemy.filter(e => e !== id);
        return this;
    }

    addTeamAlly(id) {
        this.ally.push(id);
        return this;
    }

    removeTeamAlly(id) {
        this.ally = this.ally.filter(e => e !== id);
        return this;
    }

    setColor(color) {
        const safeColor = (color.math(/^(\#)[x00-xF7]{6}$/gm) || [])[0];
        if(!safeColor || !safeColor.length) throw new TypeError('Not valid color');
        this.color = safeColor;
        return this;
    }

    setThumbnail(url) {
        const safeUrl = (url.match(/^(https:\/\/)[x00-xF7\.]+(.)[x00-xF7\/\?]+$/gm) || [])[0];
        if(!safeUrl || !safeUrl.length) throw new TypeError('Not valid url');
        this.thumbnail = safeUrl;
        return this;
    }

    setSlogan(slogan) {
        this.slogan = slogan;
        return this;
    }

    setBalance(amount) {
        this.balance = amount
        return this;
    }

    setUsersWhoClaimed(array){
        this.claimed = array;
        return this;
    }


}

module.exports = Team;
class GuildData {
    constructor(id, data) {
        this.data = data;
        this.id = id;
        this.guildData = {id: this.id, data: this.data}
    }

    getData(){
        return this.data;
    }

    setData(data){
        this.data = data;
        return this;
    }
}

module.exports = GuildData;
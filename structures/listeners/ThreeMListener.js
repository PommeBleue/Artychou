class ThreeMListener {
    constructor(client) {
        this.map = new Map();
        this.initialId = null;
    }

    async doAsync(message){
        if (this.map.size === 0) {
            this.map.set(message.author.id, message.content);
            this.initialId = message.author;
            return;
        } else {
            if(message.content === this.map.get(this.initialId.id)) {
                if(this.map.size < 3) {
                    for(let key of this.s.keys()) {
                        if (message.author.id === key) return;
                    }
                    this.map.set(message.author.id, message.content);
                }
                if(this.map.size === 3) {
                    await message.channel.send(message.content);
                    return;
                }
            } else {
                this.map = new Map();
                this.map.set(message.author.id, message.content);
            }
        }
    }
}
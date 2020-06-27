const ErrorEmbed = require('../embeds/ErrorEmebed');

class Transaction {
    constructor({sender, receiver}, message) {
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.userManager = message.users;
    }

    async init(amount) {
        const sender = this.sender;
        const receiver = this.receiver;
        return await this.transfer(sender, receiver, amount);
    }

    async transfer(sender, receiver, amount) {
        const message = this.message
        const channel = message.channel;
        const settings = message.settings
        const canTransfer = /\d+/.test(sender) && /\d+/.test(receiver);
        if(receiver === sender) {
            const embed = new ErrorEmbed(`Hein ?? Qui essaye de se payer lui-même stp ??`, settings).build();
            await channel.send({embed});
            throw new Error('UserNull exception.');
        }
        if(amount <= 0) {
            const embed = new ErrorEmbed(`Amount cannot be less than **0**.`, settings).build();
            await channel.send({embed});
            throw new Error('Amount less than zero exception.');
        }
        if(canTransfer) {
            const userSender = this.userManager.getUserById(sender);
            const userReceiver = this.userManager.getUserById(receiver);

            if(userSender.getBalance() < amount) {
                const embed = new ErrorEmbed(`Il vous manque ${message.func.numberFormat((Math.abs(Number(amount) - Number(userSender.getBalance()))))} peppas pour effectuer cette transaction.`, settings).build();
                await channel.send({embed});
                throw new Error('Amount less than zero exception.');
            }

            const balSender = Number(userSender.getBalance()) - Number(amount);
            const balReceiver = Number(userReceiver.getBalance()) + Number(amount);
            console.log(typeof balSender, balSender);
            console.log(typeof balReceiver, balReceiver);
            userSender.setBalance(balSender);
            userReceiver.setBalance(balReceiver);

            this.userManager.UpdateUserLocal(sender, userSender);
            await this.userManager.UpdateUserAsync(userSender);
            this.userManager.UpdateUserLocal(receiver, userReceiver);
            await this.userManager.UpdateUserAsync(userReceiver);

            return {amount: message.func.numberFormat(amount), receiver: userReceiver, sender: userSender}
        }
        const embed = new ErrorEmbed(`The IDs that were provided are not valid IDs.`, settings).build();
        await channel.send({embed});
        throw new Error('No valid ID provided for sender and receiver');
    }
}

module.exports = Transaction;
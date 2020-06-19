/**
 *
 * @param time
 * @returns {Promise<unknown>}
 * @description Waits {time} and then returns a {Promise}.
 */
module.exports.delay = async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time);
        });
};


/**
 *
 * @param message
 * @param client
 * @returns {number}
 * @description Calculates the level of the user that sent the message.
 */
module.exports.permlevel = (message, client) => {
        let permlvl = 0;

        const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
};
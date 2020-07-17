module.exports.getFullName = (userResolvable, strict = true) => {
    if (userResolvable == null) return strict ? null : 'null';
    if (typeof userResolvable === 'string') return userResolvable;
    const mostName = getMostName(userResolvable);
    return `${mostName} (${userResolvable.id})`;
};

module.exports.getRandom = (client, guild) => {
    const id = client.users.cache.keyArray()[Math.floor(Math.random() * client.users.cache.keyArray().length)];
    return getMemberById(id, guild);
};

module.exports.getMemberByMixed = (name, guild) => {
    if (guild == null) return undefined;
    let targetMember = getMemberById(name, guild);
    if (targetMember == null) targetMember = getMemberByName(name, guild);
    return targetMember;
};

const getMemberById = (id, guild) => {
    if (id == null || guild == null) return null;

    if (id.substr(0, 1) === '<' && id.substr(id.length - 1, 1) === '>') id = getSafeId(id);

    if (id == null || id.length < 1) return null;

    return guild.members.cache.get(id);
};

const getSafeId = id => (id.match(/\d+/) || [])[0];

const getMemberByName = (name, guild) => {
    // [v3.0] Visible name match, real name match, length match, caps match, position match
    if (guild === null) return undefined;

    const nameDiscrim = getDiscriminatorFromName(name);
    if (nameDiscrim) {
        const namePre = name.substr(0, name.length - 5);
        const member = guild.members.cache.find(m => m.user.username === namePre && m.user.discriminator === nameDiscrim);
        if (member) return member;
    } else {
        const member = guild.members.cache.find(m => m.user.username.toLowerCase() === name.toLowerCase());
        if(member) return member;
    }

    let removeUnicode = true;
    const origName = name.trim();

    name = name.replace(/[^\x00-\x7F]/g, '').trim();

    if (name.length === 0) {
        name = origName;
        removeUnicode = false;
    }

    const str2Lower = name.toLowerCase();
    const { members } = guild;
    let strongest = null;


    const keys = Array.from(members.cache.keys());

    for(const k in keys) {
        const key = keys[k];
        const member = members.cache.get(key);

        let realName = member.nickname != null ? member.nickname : getName(member);
        if (removeUnicode) realName = realName.replace(/[^\x00-\x7F]/g, '');
        realName = realName.trim();
        let realstr2Lower = realName.toLowerCase();
        let nameMatch = realstr2Lower.indexOf(str2Lower);

        const strength = { member };
        let layer = 0;

        if (nameMatch >= 0) {
            strength[layer++] = 2;
        } else {
            realName = getName(member);
            if (removeUnicode) realName = realName.replace(/[^\x00-\x7F]/g, '');
            realName = realName.trim();
            realstr2Lower = realName.toLowerCase();
            nameMatch = realstr2Lower.indexOf(str2Lower);
            if (nameMatch >= 0) {
                strength[layer++] = 1;
            }
        }

        if (nameMatch >= 0) {
            const filled = Math.min(name.length / realName.length, 0.999);
            strength[layer++] = filled;

            const maxCaps = Math.min(name.length, realName.length);
            let numCaps = 0;
            for (let j = 0; j < maxCaps; j++) {
                if (name[j] === realName[nameMatch + j]) numCaps++;
            }
            strength[layer++] = Math.min(numCaps / maxCaps, 0.999);

            const totalPosition = realName.length - name.length;
            strength[layer++] = 1 - (totalPosition * nameMatch === 0 ? 0.001 : nameMatch / totalPosition);

            if (strongest == null) {
                strongest = strength;
            } else {
                for (let i = 0; i < layer; i++) {
                    if (strength[i] > strongest[i]) {
                        strongest = strength;
                        break;
                    } else if (strength[i] < strongest[i]) {
                        break;
                    }
                }
            }
        }
    }
    return strongest != null ? strongest.member : undefined;
};

const getDiscriminatorFromName = (name) => {
    const discrimPattern = /#(\d\d\d\d)$/gm;
    let discrim = discrimPattern.exec(name);
    discrim = discrim ? discrim[1] : null;
    return discrim;
};

const isMember = userRes => userRes.user != null;

const getName = (userResolvable) => {
    if (userResolvable == null) return null;
    if (typeof userResolvable === 'string') return userResolvable;
    return isMember(userResolvable) ? userResolvable.user.username : userResolvable.username;
};

const getMostName = (userResolvable) => {
    if (userResolvable == null) return null;
    if (typeof userResolvable === 'string') return userResolvable;
    const username = getName(userResolvable);
    const discrim = isMember(userResolvable) ? userResolvable.user.discriminator : userResolvable.discriminator;
    return `${username}#${discrim}`;
};
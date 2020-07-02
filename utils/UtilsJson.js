const fse = require("fs-extra");

module.exports.getKeysInArray = (object) => {
    const array = [];
    for(const key in object) array.push(String(key));
    return array;
};

module.exports.readJsonSync = (pathToFile) => {
    return fse.readJsonSync(pathToFile);
};

module.exports.readJson = async (pathToFile) => {
    return await fse.readJson(pathToFile);
};

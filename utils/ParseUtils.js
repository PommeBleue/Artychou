const { parseArgCombosInner } = require("./UtilFunctions");

module.exports.parse = (arg, func, numParams, ...args) => {
    const combos = parseArgCombosInner(arg, numParams);
    console.log(combos);
    let result = undefined;
    for(let i in combos) {
        const array = [];
        if(combos[i].length !== numParams) continue;
        for(let j = 0; j < numParams; j++) {
            console.log(combos[i][j]);
            array.push(func(combos[i][j], ...args));
        }
        if(array.every(e => e !== undefined && e!== null)) {
            result = array;
            break;
        }
    }
    return result;
};
/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if(obj === undefined){
        return;
    }

    if(Object.keys(obj).length === 0) {
        return {};
    }

    let result = {};
    const revArr = [];
    const arr = Object.entries(obj);

    for(let i = 0; i < arr.length; i++){
        revArr.push(arr[i].reverse());
    }

    const map = new Map(revArr);
    result = Object.fromEntries(map.entries());

    return result;
}

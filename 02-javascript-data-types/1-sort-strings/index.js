/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    let result = [];
    let arrCopy = arr.slice();

    switch (param) {
        case "asc":
            result = arrCopy.sort(compareFunction);
            break;
        case "desc":
            result = arrCopy.sort(reverseCompareFunction);
            break;

        default:
            result = arrCopy.sort(compareFunction);
    }

    return result;
}

function compareFunction(a, b){
    return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
}

function reverseCompareFunction(a, b){
    return b.localeCompare(a, ['ru', 'en'], {caseFirst: 'upper'});
}
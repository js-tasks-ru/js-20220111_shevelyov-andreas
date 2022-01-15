/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    let result = [];

    switch (param) {
        case "asc":
            result = sortArray(arr);
            break;
        case "desc":
            result = sortArray(arr).reverse();
            break;

        default:
            result = sortArray(arr);
    }

    return result;
}

function sortArray(array){
    let result = array.slice();

    for(let i = 0; i < result.length; i++){
        for (let j = 0; j < result.length-1-i; j++) {
            if(j < result.length){
                if(result[j].localeCompare(result[j+1], 'ru-RU-u-kf-upper') > 0){
                    let iElement = result[j];
                    let nextElement = result[j+1];
                    result[j] = nextElement;
                    result[j+1] = iElement;
                }
            }
            
        }
    }

    return result;
}
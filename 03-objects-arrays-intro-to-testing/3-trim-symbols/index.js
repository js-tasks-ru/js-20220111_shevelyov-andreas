/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(size <= 0 || string === ""){
        return "";
    }

    if(size === undefined){
        return string;
    }

    const array = string.split("");
    let count;
    let resultString = "";
    let ISymbol;

    for(let i = 0; i < array.length; i++){
        if(ISymbol != array[i]){
            ISymbol = array[i];
            count = 1;
        }
        
        if(count <= size){
            resultString = resultString + array[i];
        }

        count ++;
    }

    return resultString;
}
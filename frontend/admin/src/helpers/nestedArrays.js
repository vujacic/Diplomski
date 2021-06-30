function spliceFromNested(arr, uuid){
    for(let i = 0; i<arr.length; i++){
        if(findNested(arr, arr[i], uuid, i) == true)
            return true;
    }
    return false;
}

function findNested(pare, obj, uuid, i){
    if(obj.uuid == uuid){
         // const zmaj = obj.menu;
        // pare.concat(obj.menu);
        pare.splice(i,1, ...obj.menu);
        // zmaj.forEach(x => pare.push(x))
        return true;
    }
    if(obj && obj.menu && obj.menu.length > 0){
        for(let j=0; j<obj.menu.length; j++){
            if(findNested(obj.menu, obj.menu[j], uuid, j) == true)
                return true;
        }
    }
    return false;
}

export default {findNested, spliceFromNested}

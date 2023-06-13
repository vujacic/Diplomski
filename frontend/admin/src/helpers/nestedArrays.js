function spliceFromNested(arr, uuid){
    for(let i = 0; i<arr.length; i++){
        let found = findNested(arr, arr[i], uuid, i)
        if(found != null)
            found.parent.splice(found.i, 1, ...found.son.menu);
    }
}

function findNested(pare, obj, uuid, i){
    if(obj.uuid == uuid){
         // const zmaj = obj.menu;
        // pare.concat(obj.menu);
        //pare.splice(i, 1, ...obj.menu);
        // zmaj.forEach(x => pare.push(x))
        return {parent: pare, son: obj, count: i};
    }
    if(obj && obj.menu && obj.menu.length > 0){
        for(let j=0; j<obj.menu.length; j++){
            var found = findNested(obj.menu, obj.menu[j], uuid, j);
            if(found != null)
                return found;
        }
    }
    return null;
}

function updateNested(arr, uuid, value){
    for(let i = 0; i<arr.length; i++){
        let found = findNested(arr, arr[i], uuid, i)
        if(found != null)
            found.son.title = value;
    }
}

export default {updateNested, spliceFromNested}
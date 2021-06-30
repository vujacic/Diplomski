const inlineElements = ['a','b','strong','br','em','i']

function indentHtml(source){
    let dest = '';
    if(!source){
        return dest;
    }
    for(let i=0; i<source.length; i++){
        let x = source[i];
        if(x == '<') {
            let tag = getTag(source, i+1);
            if (i == 0)
                dest += x;
            else if(source[i+1] == '/'){
                dest += x;
            }
            else if(inlineElements.findIndex(el => el == tag) != -1)
                dest += x;
            else
                dest += '\n' + x;
        }
        else {
            dest += x;
        }
    }
    return dest;
}


function cleanHtml(source){
    let dest = '';
    for(let i=0; i<source.length; i++){
        let x = source[i];
        if(x == '\n'){
            // if(source[i+1] == '<'){
                continue;
            // }
        }
        dest += x;
    }
    dest = dest.trim();
    return dest;
}

function getTag(source, start, maxLength = 10){
    if(!source)
        return '';
    let dest = source.substring(start, start + maxLength+1);
    let end = dest.indexOf('>');
    if(end != -1){
        let ret = dest.substring(0, end);
        return ret;
    }
    return '';
}

export default {
    indentHtml,
    cleanHtml
}

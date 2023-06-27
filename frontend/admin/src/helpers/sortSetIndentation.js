function sortSetIndentation(input, output = []) {
    // let output = [];
    if(input.length == 0)
        return;
    let notProcessed = []
    input.forEach((ele) =>{
        if(!ele.parentId){
            ele.indent = 0;
            output.push(ele);
        } else {
            let lastIndex = output.findLastIndex(x => x._id == ele.parentId || x.parentId == ele.parentId);
            if(lastIndex == -1)
                notProcessed.push(ele);
            else{
                let parentIndex = output.findLastIndex(x => x._id == ele.parentId);
                ele.indent = output[parentIndex].indent + 1;
                output.splice(lastIndex + 1, 0, ele);
            }
        }
    });
    sortSetIndentation(notProcessed, output);
    return output;
}

function setIndent(input, indent){
    input.forEach((ele) => {
       for(let i=0; i<ele.indent; i++){
           ele.name = indent + ele.name;
       }
    });
}

export default {
    sortSetIndentation, setIndent
}
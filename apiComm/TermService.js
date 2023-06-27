module.exports = (ax) =>{
    function getTerm(id){
        return ax.get(`term/${id}`);
    }

    function getTermByType(params){
        return ax.get('term',{params: params});
    }

    function putTerm(id, content){
        return ax.put(`term/${id}`, content);
    }

    function postTerm(content){
        return ax.post(`term`, content);
    }

    function deleteTerm(id){
        return ax.delete(`term/${id}`);
    }

    return {
        getTerm,
        getTermByType,
        putTerm,
        postTerm,
        deleteTerm
    }
}
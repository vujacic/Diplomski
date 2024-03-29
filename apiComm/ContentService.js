// import ax from './ApiConfig'

module.exports = (ax) =>{
    function getContent(id){
        return ax.get(`content/${id}`);
    }

    function getPagedContent(params){
        return ax.get('content',{params: params});
    }

    function getByCategory(params){
        return ax.get('content/getByCategory',{params: params});
    }

    function getBySearch(params){
        return ax.get('content/search',{params: params});
    }

    function putContent(id, content){
        return ax.put(`content/${id}`, content);
    }

    function postContent(content){
        return ax.post(`content`, content);
    }

    function deleteContent(id){
        return ax.delete(`content/${id}`);
    }

    return {
        getContent,
        getPagedContent,
        putContent,
        postContent,
        deleteContent,
        getByCategory,
        getBySearch
    }
}


// export default {
//     getContent,
//     getPagedContent,
//     putContent,
//     postContent,
//     deleteContent
// }

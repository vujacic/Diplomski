import ax from './ApiConfig'

function getContent(id){
    return ax.get(`content/${id}`);
}

function getPagedContent(params){
    return ax.get('content/',{params: params});
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

export default {
    getContent,
    getPagedContent,
    putContent,
    postContent,
    deleteContent
}

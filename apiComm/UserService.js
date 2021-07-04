//import ax from './ApiConfig'

module.exports = (ax) =>{

    function getUser(id){
        return ax.get(`user/${id}`);
    }

    function getPagedUsers(params){
        return ax.get('user',{paramsSerializer: params});
    }

    function putUser(id, user){
        return ax.put(`user/${id}`, user);
    }

    function postUser(user){
        return ax.post(`user`, user);
    }

    // function deleteUser(id){
    //     return ax.delete(`user/${id}`);
    // }

    return {
        getUser,
        getPagedUsers,
        putUser,
        postUser
    }
}


// export default {
//     getUser,
//     getPagedUsers,
//     putUser,
//     postUser
// }

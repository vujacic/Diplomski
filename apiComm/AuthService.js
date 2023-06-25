module.exports = (ax) =>{
    function login(emailPass){
        return ax.post('auth', emailPass);
    }

    return {
        login
    }
}
module.exports = (ax) => {
    function getOptions() {
        return ax.get(`option`);
    }

    function getOption(id) {
        return ax.get(`option/${id}`);
    }

    function putOptions(options){
        return ax.put(`option`, options)
    }

    return {
        getOptions,
        getOption,
        putOptions
    }
}
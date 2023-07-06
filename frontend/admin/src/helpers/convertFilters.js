function lazyToFilter(lazy){
    return {
        page: lazy.first.toString(),
        limit: lazy.rows.toString(),
        order: lazy.sortOrder == 1 ? 'asc' : 'desc',
        sort: lazy.sortField ? lazy.sortField : 'date'
    }
}

function filterToLazy(filter){
    return {
        first: parseInt(filter.page),
        rows: parseInt(filter.limit),
        sortOrder: filter.order == 'asc' ? 1 : -1,
        sortField: filter.sort
    }
}

function lazyToFilterAndReplace(filter, lazy){
    let lazyTransformed = lazyToFilter(lazy);
    Object.keys(filter).forEach(key => {
        if (key in lazyTransformed) {
            filter[key] = lazyTransformed[key];
        }
    });
}

export default {
    lazyToFilter,
    filterToLazy,
    lazyToFilterAndReplace
}

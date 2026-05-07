const paginate = async (model , query = {} , reqQuery = {} , options = {}) => {
    const {page = 1 , limit = 5 , sort = '-createdAt'} = reqQuery;

    const paginationOptions = {
        page : parseInt(page) ,
        limit : parseInt(limit) ,
        sort,
        ...options
    }

    try{
        const result = await model.paginate(query , paginationOptions)

        return {
            data: result.docs,
            lastPage : result.lastPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            currentPage : result.page,
            counter : result.pagingCounter,
            limit: result.limit,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        }
    }catch(err){
        console.log("Pagination Error" , err);

    }
}


export default paginate;
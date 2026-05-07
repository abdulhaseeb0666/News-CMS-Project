import Comment from "../models/Comments.js";
import News from "../models/News.js";
import paginate from "../utils/paginate.js";


export const allComments = async (req, res, next) => {
    try{
        let paginatedComments;
        if(req.role == "admin"){
            paginatedComments = await paginate(Comment , {} , req.query , {
            sort : "-timestampes",
            populate : [
                {path : "article" , select : "title author"}
            ]
            })
        }
        else{
            const author = req.id;
            const articles = await News.find({author});
            paginatedComments = await paginate(Comment , {article : {$in : articles}} , req.query , {
            sort : "-timestampes",
            populate : [
                {path : "article" , select : "title author"}
            ]
            })
        }

        // res.send(paginatedComments)
        res.render("admin/comments/index" , {role:req.role , paginatedComments});
    }catch(err){
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.id).populate("article" , "author");
        if(!comment){
            const error = new Error("Comment not found");
            error.status = 404;
            return next(error);
        }
        if(req.role == "author"){
            if(comment.article.author != req.id){
                const error = new Error("Comment not found");
                error.status = 404;
                return next(error);
            }
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.redirect("/admin/comments");
    }catch(err){
        next(err);
    }
};
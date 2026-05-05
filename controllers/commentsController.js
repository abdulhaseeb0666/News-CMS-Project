import Comment from "../models/Comments.js";

export const allComments = async (req, res, next) => {
    try{
        res.render("admin/comments/index" , {role:req.role});
    }catch(err){
        next(err);
    }
};
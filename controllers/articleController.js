import Category from "../models/Category.js";
import News from "../models/News.js";
import User from "../models/Users.js";
import fs from "fs";
import { validationResult } from "express-validator";

export const allArticle = async (req, res, next) => {
    try{
        if(req.role == "admin"){
            const news = await News.find().populate("category" , "name").populate("author" , "fullname").sort({createdAt : -1});
            return res.render("admin/articles/index" , {articles:news , role:req.role})
        }else{
            const news = await News.find({author : req.id}).populate("category" , "name").populate("author" , "fullname").sort({createdAt : -1});
            res.render("admin/articles/index" , {articles:news , role:req.role})
        }
    }catch(err){
        next(err);
    }
};

export const addArticlePage = async (req, res, next) => {
    try{
        const categories = await Category.find();
        res.render("admin/articles/create" , {categories  , role:req.role , errors : 0})
    }catch(err){
        next(err)
    }
};

export const addArticle = async (req, res, next) => {
    
    const errors = validationResult(req);
    const categories = await Category.find();
    if(!errors.isEmpty()){
        if (req.file) {
                fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            }
        return res.render("admin/articles/create" , {categories , role:req.role , errors : errors.array()})
    }
    try{
        if (req.file) {
            req.body.image = req.file.filename; 
            req.body.author = req.id;
        }   
        await News.create(req.body);
        res.redirect("/admin/article");
    }catch(err){
        if (req.file) {
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        }
        next(err);
    }
};

export const updateArticlePage = async (req, res , next) => {
    try{
    const article = await News.findById(req.params.id). populate("category" , "name").populate("author" , "fullname");
    const categories = await Category.find();
    if(!article){
        const error = new Error("Article not found");
        error.status = 404;
        return next(error);
    }
    if(req.role == "author"){
        if(article.author._id != req.id){
            const error = new Error("Article not found");
            error.status = 404;
            return next(error);
        }
    }
        res.render("admin/articles/update" , {article , categories , role:req.role , errors:0})
    }catch(err){
        next(err);
    }
};

export const updateArticle = async (req, res, next) => {
    
    const article = await News.findById(req.params.id).populate("category" , "name").populate("author" , "fullname");
    const errors = validationResult(req);
    const categories = await Category.find();
    if(!errors.isEmpty()){
        if (req.file) {
                fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            }
        return  res.render("admin/articles/update" , {article , categories , role:req.role , errors:errors.array()})
    }
    if(!article){
        const error = new Error("Article not found");
        error.status = 404;
        return next(error);
    }
    
    if(req.role == "author"){
        if(article.author._id != req.id){
            if (req.file) {
                fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            }
            return res.status(401).send("Unauthorized");
        }
    }
    try{
        if (req.file) {
            fs.unlinkSync(`./public/uploads/${article.image}`);
            req.body.image = req.file.filename; 
        }   
        await News.findByIdAndUpdate(req.params.id , req.body);
        console.log(req.body);
        res.redirect("/admin/article");
    }catch(err){
        if (req.file) {
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        }
        next(err);
    }
};

export const deleteArticle = async (req, res, next) => {
    const article = await News.findById(req.params.id);
    if(!article){
        const error = new Error("Article not found");
        error.status = 404;
        return next(error);
    }
    try{
        if(req.role == "author"){
            if(article.author._id != req.id){
                const error = new Error("Article not found");
                error.status = 404;
                return next(error);
            }
        }
        fs.unlinkSync(`./public/uploads/${article.image}`);
        await News.findByIdAndDelete(req.params.id);
        res.redirect("/admin/article");
    }catch(err){
        next(err);
    }
};

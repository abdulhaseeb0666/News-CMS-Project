import mongoose from "mongoose";

import Category from "../models/Category.js";
import News from "../models/News.js";
import User from "../models/Users.js";
import Comment from "../models/Comments.js";

export const index = async (req, res) => {
    const articles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    res.render("index.ejs" , {articles , categories});
};

export const articleByCategory = async (req, res) => {
    const articles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const category = await Category.findOne({slug : req.params.name});
    const categoryArticles = await News.find({category : category._id}).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    
    res.render("category.ejs" , {categoryArticles , categories , category , articles});
};

export const author = async (req, res) => {
    const articles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const author = await User.findOne({fullname : req.params.name});
    const authorArticles = await News.find({author : author.id}).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    
    res.render("author.ejs" , {articles , categories , author , authorArticles});
    
};

export const singleArticle = async (req, res) => {
    const articles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const article = await News.findById(req.params.id).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});

    res.render("single.ejs" , {article , categories , articles});
    
};

export const search = async (req, res) => {
    const search = req.query.search;

    const articles = await News.find({$or : [
        {title : {$regex : search , $options : "i"}},
        {content : {$regex : search , $options : "i"}},
    ]}).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    res.render("search.ejs" , {articles , categories , search});
    
};

export const addcomment = async (req, res) => {};
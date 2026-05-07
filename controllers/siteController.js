import mongoose from "mongoose";

import Category from "../models/Category.js";
import News from "../models/News.js";
import User from "../models/Users.js";
import Comment from "../models/Comments.js";
import Setting from "../models/Setting.js";

import paginate from "../utils/paginate.js";
import { populate } from "dotenv";

export const index = async (req, res) => {
    const setting = await Setting.findOne();

    const recentAarticles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : -1});
    
    const paginatedArticles = await paginate(News , {} , req.query , {
        sort : "-createdAt",
        populate : [
            {path : "category" , select : "name slug"},
            {path : "author" , select : "fullname"}
        ]
    }) 

    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    res.render("index.ejs" , {paginatedArticles , categories , setting , recentAarticles});
};

export const articleByCategory = async (req, res) => {
    const setting = await Setting.findOne();

    const recentAarticles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : -1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const category = await Category.findOne({slug : req.params.name});
    
    const paginatedArticles = await paginate(News , {category : category._id} , req.query , {
        sort : "-createdAt",
        populate : [
            {path : "category" , select : "name slug"},
            {path : "author" , select : "fullname"}
        ]
    })

    res.render("category.ejs" , {paginatedArticles , categories , category , recentAarticles , setting});
};

export const author = async (req, res) => {
    const setting = await Setting.findOne();

    const recentAarticles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : -1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const author = await User.findOne({fullname : req.params.name});
    const authorArticles = await News.find({author : author.id}).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    
    const paginatedArticles = await paginate(News , {author : author.id} , req.query , {
        sort : "-createdAt",
        populate : [
            {path : "category" , select : "name slug"},
            {path : "author" , select : "fullname"}
        ]
    })

    res.render("author.ejs" , {paginatedArticles , categories , author , recentAarticles , setting});
    
};

export const singleArticle = async (req, res) => {
    const setting = await Setting.findOne();

    const recentAarticles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : -1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const article = await News.findById(req.params.id).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});

    const paginatedComments = await paginate(Comment , {article : article._id} , req.query , {
        sort : "-timestampes",
        populate : [
            {path : "article" , select : "title"}
        ]
    })

    res.render("single.ejs" , {recentAarticles , categories , article , setting , paginatedComments});
};

export const search = async (req, res) => {
    const setting = await Setting.findOne();
    
    const search = req.query.search;
    
    const recentAarticles = await News.find().populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : -1});
    const articles = await News.find({$or : [
        {title : {$regex : search , $options : "i"}},
        {content : {$regex : search , $options : "i"}},
    ]}).populate("category" , {name : 1 , slug : 1}).populate("author" , "fullname").sort({createdAt : 1});
    const categoriesInUse = await News.distinct("category");
    const categories = await Category.find({_id : {$in : categoriesInUse}});
    
    const paginatedArticles = await paginate(News , {$or : [
        {title : {$regex : search , $options : "i"}},
        {content : {$regex : search , $options : "i"}},
    ]} , req.query , {
        sort : "-createdAt",
        populate : [
            {path : "category" , select : "name slug"},
            {path : "author" , select : "fullname"}
        ]
    })
    
    res.render("search.ejs" , {recentAarticles , paginatedArticles ,  categories , search , setting});
};

export const addcomment = async (req, res) => {
    const {name , email , content} = req.body;
    const article = await News.findById(req.params.id);
    
    const comment = new Comment({name , email , content , article : article._id});
    await comment.save();
    
    res.redirect(`/single/${req.params.id}`);
};
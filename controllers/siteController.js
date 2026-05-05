import mongoose from "mongoose";

import Category from "../models/Category.js";
import News from "../models/News.js";
import User from "../models/Users.js";
import Comment from "../models/Comments.js";

export const index = async (req, res) => {
    res.render("index.ejs");
};

export const articleByCategory = async (req, res) => {
    res.render("category.ejs");
    
};

export const singleArticle = async (req, res) => {
    res.render("single.ejs");
    
};

export const search = async (req, res) => {
    res.render("search.ejs");
    
};

export const author = async (req, res) => {
    res.render("author.ejs");
    
};

export const addcomment = async (req, res) => {};
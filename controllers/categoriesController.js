import Category from "../models/Category.js";
import News from "../models/News.js";
import { validationResult } from "express-validator";

export const allCategory = async (req, res, next) => {
    try{
        const categories = await Category.find();
        const articles = await News.find();
        res.render("admin/categories/index" , {categories:categories , articles , role:req.role})
    }catch(err){
        next(err);
    }
};

export const addCategoryPage = async (req, res, next) => {
    try{
        res.render("admin/categories/create" , {role:req.role , errors : 0})
    }catch(err){
        next(err);
    }
};

export const addCategory = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/categories/create" , {role:req.role , errors : errors.array()})
    }

    const {name , description} = req.body;
    try{
        await Category.create({name , description});
        res.redirect("/admin/category");
    }catch(err){
        next(err);
    }
};

export const updateCategoryPage = async (req, res, next) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }
        res.render("admin/categories/update" , {category: category , role:req.role , errors : 0})
    }catch(err){
        next(err);
    }
};  

export const updateCategory = async (req, res, next) => {
    
    const category = await Category.findById(req.params.id);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/categories/update" , {category: category , role:req.role , errors : errors.array()})
    }

    const {name , description} = req.body;
    try{
        const category = await Category.findById(req.params.id);
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.redirect("/admin/category");
    }catch(err){
        next(err);
    }
};

export const deleteCategory = async (req, res, next) => {
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/admin/category");
    }catch(err){
        next(err);
    }
};
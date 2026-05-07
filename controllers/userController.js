import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import fs from "fs";
import { validationResult } from "express-validator";

// Models
import User from "../models/Users.js";
import News from "../models/News.js";
import Category from "../models/Category.js";
import Comment from "../models/Comments.js";
import Setting from "../models/Setting.js";

export const dashboard = async (req , res, next) =>{
    try{
        let articlesCount;
        if(req.role == "author"){
            articlesCount = await News.countDocuments({author : req.id});    
        }
        else{
            articlesCount = await News.countDocuments();    
        }
        const categoriesCount = await Category.countDocuments();
        const usersCount = await User.countDocuments();
        res.render("admin/dashboard" , {role:req.role , fullname : req.fullname , articlesCount , categoriesCount , usersCount});
    }catch(err){
        next(err);
    }
}

export const settings = async (req, res, next) =>{
    try{
        const settings = await Setting.findOne();
        if(!settings){
            return res.render("admin/settings" , {role : req.role});    
        }
        res.render("admin/settings" , {settings , role:req.role})
    }catch(err){
        next(err);
    }
}

export const saveSettings = async (req, res, next) =>{
    try{
        const settings = await Setting.findOne();
        if(req.file){
            fs.unlinkSync(`./public/uploads/${settings.website_logo}`);
        }
        await Setting.findOneAndDelete({});
    
        const {website_title , footer_description} = req.body;
        const website_logo = req.file ? req.file.filename : settings.website_logo;
    
        try{
            const settings = await Setting.findOneAndUpdate(
                {} , 
                {website_title , website_logo , footer_description} , 
                {upsert : true , new : true}
            );
    
            res.redirect("/admin/settings");
        }catch(err){
            if(req.file){
                fs.unlinkSync(`./public/uploads/${req.file.filename}`);
            }
            next(err);
        }
    }catch(err){
        if(req.file){
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        }
        next(err);
    }
}

export const login = (req, res, next) => {
    try{
        res.render("admin/login" , {
            layout : false,
            errors : 0 
        })
    }catch(err){
        next(err);
    }
}

export const adminLogin = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/login" , {
            layout : false,
            errors : errors.array()
        })
    }

    try{
        const {username , password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            const error = new Error("User not found");
            error.status = 404;
            return next(error);    
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).send("Invalid Credentials.");
        }

        const token = jwt.sign(
            {id : user._id , role : user.role , fullname : user.fullname} , 
            process.env.JWT_SECRET , 
            {expiresIn : "1h"}
        );
        res.cookie("token" , token , {
            httpOnly : true , 
            maxAge : 60 * 60 * 1000
        });
        res.redirect("/admin/dashboard");   
    }catch(err){
        next(err);
    }
}

export const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin");
}

export const allUser = async (req, res, next) => {
    try{
        const users = await User.find();
        res.render("admin/users/index.ejs" , {users , role:req.role})
    }catch(err){
        next(err);
    }
}

export const addUserPage = (req, res, next) => {
    try{
        res.render("admin/users/create.ejs" , {role:req.role , errors : 0})
    }catch(err){
        next(err);
    }
}

export const addUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/users/create.ejs" , {role:req.role , errors : errors.array()})
    }

    try{
        await User.create(req.body);
        res.redirect("/admin/users");
    }catch(err){
        next(err);
    }
}

export const updateUserPage = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            const error = new Error("User not found");        
            error.status = 404;
            return next(error); 
        }
        res.render("admin/users/update.ejs", { user , role:req.role , errors : 0});
    }catch(err){
        next(err);
    }
}

export const updateUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/users/update.ejs", { user , role:req.role , errors : errors.array()});

    }

    const {fullname, password, role} = req.body;
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            const error = new Error("User not found");        
            error.status = 404;
            return next(error);    
        }

        user.fullname = fullname || user.fullname;
        if(password){
            user.password = await bcrypt.hash(password, 12);
        }
        user.role = role || user.role;
        await user.save(); 
        res.redirect("/admin/users");
    }catch(err){
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            const error = new Error("User not found");        
            error.status = 404;
            return next(error);    
        }
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin/users");
    }catch(err){
        next(err);
    }
}
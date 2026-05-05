import express from 'express';
import { Router } from 'express';
const router = Router();

import * as UserController from '../controllers/userController.js';
import * as categoryController from '../controllers/categoriesController.js';
import * as articleController from '../controllers/articleController.js';
import * as commentController from '../controllers/commentsController.js';

// Middlewares
import isLogin from '../middlewares/isLogin.js';
import isAdmin from '../middlewares/isAdmin.js';
import upload from '../middlewares/uploadImage.js';
import { loginValidation , userValidation , userUpdateValidation , categoryValidation , categoryUpdateValidation , articleValidation , articleUpdateValidation } from '../middlewares/validation.js';

// Login Routes
router.get("/" , UserController.login); 
router.post("/" , loginValidation , UserController.adminLogin);
router.get("/logout" , UserController.logout);
router.get("/dashboard" , isLogin , UserController.dashboard)
router.get("/settings" , isLogin , isAdmin , UserController.settings)
router.post("/save-settings" , isLogin , isAdmin ,  upload.single('website_logo') , UserController.saveSettings)

//User CRUD Routes
router.get('/users', isLogin , isAdmin , UserController.allUser);
router.get('/add-user', isLogin , isAdmin , UserController.addUserPage);
router.post('/add-user' , isLogin , isAdmin , userValidation , UserController.addUser);
router.get('/update-user/:id', isLogin , isAdmin , UserController.updateUserPage);
router.post('/update-user/:id' , isLogin , isAdmin , userUpdateValidation , UserController.updateUser);
router.get('/delete-user/:id', isLogin , isAdmin , UserController.deleteUser);

//Category CRUD Routes
router.get('/category', isLogin , isAdmin , categoryController.allCategory);
router.get('/add-category', isLogin , isAdmin , categoryController.addCategoryPage);
router.post('/add-category' , isLogin , isAdmin , categoryValidation , categoryController.addCategory);
router.get('/update-category/:id', isLogin , isAdmin , categoryController.updateCategoryPage);
router.post('/update-category/:id', isLogin , isAdmin , categoryUpdateValidation , categoryController.updateCategory);
router.get('/delete-category/:id', isLogin , isAdmin , categoryController.deleteCategory);

//Article CRUD Routes
router.get('/article', isLogin , articleController.allArticle);
router.get('/add-article', isLogin , articleController.addArticlePage);
router.post('/add-article', isLogin , upload.single("image") , articleValidation , articleController.addArticle);
router.get('/update-article/:id', isLogin , articleController.updateArticlePage);
router.post('/update-article/:id', isLogin , upload.single("image") , articleUpdateValidation , articleController.updateArticle);
router.get('/delete-article/:id', isLogin , articleController.deleteArticle);

//Comment Routes
router.get('/comments', isLogin , commentController.allComments);

// 404 Error
router.use( isLogin , (req, res , next) => {
    res.status(404).render("admin/404" , {
        message : "404 Page Not Found",
        role : req.role
    });
});

// 500 Error
router.use( isLogin , (err ,req, res , next) => {
    console.error(err);
    const status = err.status || 500;
    const view = status == 404 ? "admin/404" : "admin/500";
    res.status(500).render(view , {
        message : err.message || "Internal Server Error",
        role : req.role
    });
});


export default router;

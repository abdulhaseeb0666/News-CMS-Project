import express from 'express';
import { Router } from 'express';
const router = Router();

import { 
    index , 
    articleByCategory , 
    singleArticle , 
    search , 
    author , 
    addcomment 
} from '../controllers/siteController.js';


router.get("/" , index);
router.get("/category/:name" , articleByCategory);
router.get("/single/:id" , singleArticle);
router.get("/search/" , search);
router.get("/author/:name" , author);
router.post("/single/:id/comment" , addcomment);

// 404 Error
router.use((req, res , next) => {
    res.status(404).render("404" , {
        message : "404 Page Not Found",
    });
});

// 500 Error
router.use((err ,req, res , next) => {
    console.error(err);
    const status = err.status || 500;
    const view = status == 404 ? "admin/404" : "admin/500";
    res.status(500).render(view , {
        message : err.message || "Internal Server Error",
    });
});

export default router;
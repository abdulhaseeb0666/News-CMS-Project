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

export default router;
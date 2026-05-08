import express from "express";
const app = express();
import mongoose from "mongoose";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import dotenv from "dotenv";
dotenv.config();
import minifyHTML from "express-minify-html-terser";

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(path.resolve() , "public")));
app.use(cookieParser());
app.use(expressLayouts);
app.set("view engine" , "ejs");
app.set("layout" , "layout" )
app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB" , err);
});

// Routes
import frontroutes from "./routes/frontend.js";
import adminroutes from "./routes/admin.js"

app.use("/" , frontroutes )

app.use("/admin" , (req , res , next) => {
    res.locals.layout = "admin/layout";
    next();
})
app.use("/admin" , adminroutes )


app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
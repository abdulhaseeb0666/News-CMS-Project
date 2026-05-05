import {body} from "express-validator";

export const loginValidation = [
    body("username").notEmpty().withMessage("Username is required")
        .trim()
        .matches(/^\S+$/).withMessage("Username must not contain spaces")
        .isLength({min: 5, max: 15}).withMessage("Username must be between 5 and 15 characters long")
        .escape()
    ,
    body("password")
        .notEmpty().withMessage("Password is required")
        .trim()
        .matches(/^\S+$/).withMessage("Password must not contain spaces")
        .isLength({min: 5, max: 15}).withMessage("Password must be between 5 and 15 characters long")
        .escape()

]

export const userValidation = [
    body("fullname")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),

    body("username")
        .notEmpty() 
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["admin", "author"])
        .withMessage("Role must be either admin or user"),
]

export const userUpdateValidation = [
    body("fullname")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),

    body("username")
        .optional()
        .custom((value, { req }) => {
        if (value) {
            throw new Error("Username cannot be updated");
        }
        return true;
        }),

    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("role")
        .optional()
        .isIn(["admin", "user"])
        .withMessage("Role must be either admin or user")
]

export const categoryValidation = [
    body("name")
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Category name must be between 3 and 50 characters long")
        .trim(),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Description must not exceed 20 characters")
]

export const categoryUpdateValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),

  body("description")
    .optional({ checkFalsy: true }) // ignore empty string
    .trim()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
];

export const articleValidation = [
    // Title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long"),

  // Content
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content must be at least 20 characters long"),

  // Category
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
]

export const articleUpdateValidation = [
  // Title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long"),

  // Content
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content must be at least 20 characters long"),

  // Category
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
];
import express from 'express'
import authenticate from '../middlewares/auth.middlewares.js';
import multer from 'multer';
import createProductValidator from '../validators/product.validator.js';
import { createProduct, deleteProduct, getProductById, listProducts,  updateProduct } from '../controllers/product.controllers.js';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 5 * 1024 * 1024  //5MB
    }
})

const router = express.Router();

//CREATE
router.post("/create", authenticate, (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            messege: "User is not authorized to create products"
        })
    }
    next()
},
    upload.array("images"),
    (req, res, next) => {
        req.body?.price && (req.body.price = JSON.parse(req.body.price))
        req.body?.size && (req.body.sizes = JSON.parse(req.body.sizes))
        next()
    }, createProductValidator, createProduct);

//READ
router.get("/get", listProducts);
//READ:ID
router.get("/get/:id", getProductById);

//UPDATE 
router.put("/update/:id", authenticate, (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            messege: "User is not authorized to update product details"
        })
    }
    next()
}, upload.array("images"), (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price))
    req.body?.size && (req.body.sizes = JSON.parse(req.body.sizes))
    next()
}, updateProduct);

//DELETE
router.delete("/delete/:id", authenticate, (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            messege: "User is not authorized to delete product"
        })
    }
}, deleteProduct);




export default router;
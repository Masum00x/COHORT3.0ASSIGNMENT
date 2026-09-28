import {body, validationResult} from 'express-validator'


const createProductValidator = [
    body("title")
        .exists().withMessage("Tile is requied").bail()
        .isString().withMessage("Title must be string").bail()
        .trim()
        .isLength({min:2,max:100}).withMessage("must be between 2 and 100")
        .isAlpha('en-US',{ignore:" "}).withMessage("Title can only have en small case and capital case letters"),
    body("description")
        .exists().withMessage("Description required").bail()
        .isString().withMessage("Description must be string").bail()
        .trim()
        .isLength({min:20,max:500}).withMessage("Description must be between 20 and 500 characters"),
    body("price.amount")
        .exists().withMessage("Price amont is required").bail()
        .isFloat({min:0}).withMessage("Price amount must be a floating numnber and must be greater than 0"),
    body("price.currency")
        .exists().withMessage("Currency is required").bail()
        .isString().withMessage("Currency must be a string value")
        .isIn(["INR","USD"]).withMessage("Currency either be INR or USD"),
    body("sizes")
        .exists().withMessage("Sizes are required").bail()
        .isArray().withMessage("sizes must be an array object"),
    body("sizes.*.size")
        .exists().withMessage("size must be present with every entry").bail()
        .trim()
        .isIn(),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({
                messege:"Invald request",
                errors:errors.array()
            })
        }
        next();
    }
];

export default createProductValidator;
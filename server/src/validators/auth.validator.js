import {body, validationResult} from 'express-validator'


const registerValidator = [
    body('email')
        .exists().withMessage("Email is required").bail()
        .isEmail().withMessage("Enter valid email")
        .trim(),
    body('name')
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Enter valid name")
        .trim()
        .isLength({min:2, max:50}).withMessage("Length must be between 2 to 50 characters"),
    body('password')
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string ")
        .trim()
        .isLength({min:6}).withMessage("Password atleast 6 char long"),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                messege:"Invalid request",
                errors:errors.array(),
                
            })
        }
        next();
    }
        
];

const loginValildator = [
    body('email')
        .exists().withMessage("Email is required").bail()
        .isEmail().withMessage("Enter valid email")
        .trim(),
    body('password')
        .exists().withMessage("Password required").bail()
        .isString().withMessage("Enter valid password")
        .trim()
        .isLength({min:6}).withMessage("Minmum 6 char required"),
    (req,res,next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                messege:"Invalid request",
                errors:errors.array(),
                
            })
        }
        next();
    }
];

export {registerValidator,loginValildator}
import mongoose  from 'mongoose'


const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    description:{
        type:String,
        required:true,
        minlength:10,
        maxlength:500
    },
    images:{
        type:[String],
        validate:{
            validator:images => images.length <= 5,
            message:"A maximum of 5 images are allowed"
        }
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["INR","USD"],
            default:"INR"
        }
    },
    sizes:[
        {
            size:{
                type:String,
                enum:["XS","S","M","L","XL","XXL"],
                required:true
            },
            stock:{
                type:Number,
                min:0,
                default:0
            }
        }
    ],
    seller:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    }

})

const productModel = mongoose.model("products",productSchema);

export default productModel;
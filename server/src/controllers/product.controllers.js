import productModel from "../models/product.models.js";
import uploadFiles from "../services/storage.services.js"




const createProduct = async(req,res)=>{
    try {
        
        const fileUrls = [];
        for(let i = 0; i<req.files.length;i++){
            const response = await uploadFiles({
                buffer:req.files[i].buffer,
                fileName:req.files[i].originalname
            })
            fileUrls.push(response.url);
        }
        const newProduct = await productModel.create({
            title:req.body.title,
            description:req.body.description,
            price:{
                amount:req.body.price.amount,
                currency:req.body.price.currency
            },
            sizes:req.body.sizes,
            images:fileUrls,
            seller:req.user.userId
        });

        return res.status(201).json({
            messege:"Product created successfully",
            data:{
                newProduct
            }
        })

    } catch (error) {
        return res.status(500).json({
            messege:"Internal server error"
        })
    }
};

const listProducts = async(req,res)=>{
    try {
        const getProducts = await productModel.find();
        return res.status(200).json({
            messege:"Products fetched successfully",
            product:getProducts
        })
    } catch (error) {
        return res.status(500).json({
            messege:"Internal server error"
        })
    }
};

const getProductById = async(req,res)=>{
    try {
        const {id} = req.params;
        const getProduct = await productModel.findById(id);
        
        if(!getProduct){
            return res.status(404).json({
                messege:"Product not found"
            })
        }

        return res.status(200).json({
            messege:"Product fetched successfully",
            product:getProduct
        });

    } catch (error) {
        return res.status(500).json({
            messege:"Internal server error"
        })
    }
}

const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const updateProduct = await productModel.findByIdAndUpdate(
            id,
           {$set:req.body},
           {new:true, isValidator:true}
        )

        if(!updateProduct){
            return res.status(404).json({
                messege:"Product not found "
            })
        };

        return res.status(200).json({
            messege:"Product updated successfully",
            success:true,
            product:updateProduct
        });


    } catch (error) {
        return res.status(500).json({
            messege:"Internal server error"
        })
    }
};

const deleteProduct = async (req,res)=>{
    try {
        const {id} = req.params;
        const deletedItem = await productModel.findByIdAndDelete(id);

        if(!deletedItem){
            return res.status(404).json({
                messege:"Product not found"
            })
        };

        return res.status(200).json({
            success:true,
            messege:"Product deleted successfully",
        })


    } catch (error) {
        return res.status(500).json({
            messege:"Internal server error"
        })
    }
}

export {createProduct,listProducts,updateProduct,deleteProduct,getProductById}
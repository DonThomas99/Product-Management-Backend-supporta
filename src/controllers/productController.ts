import { Request, Response } from "express";
import productUsecase from "../useCase/productUsecase";
import { product } from "../domain/product";

class ProductController{
    private productUsecase:productUsecase
    constructor(productUsecase:productUsecase){
        this.productUsecase = productUsecase
    }

    async fetchAllProducts(req:Request,res:Response){
        try {
            const response = await this.productUsecase.fetchAllProducts()
            res.status(response.status).json({message:response?.message})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Error Fetching Products"})
        }
    }

    async fetchProductByUserId(req:Request,res:Response){
        try {
            const {userId}=req.body
        const response = await this.productUsecase.fetchProductByUserId(userId) 
        res.status(response.status).json({data:response.data,message:response.message})         
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Fetching Product"})
        }
    }

    async addProduct(req:Request,res:Response){
        try {
            let product:product
            product = req.body
            const files = req.files as File[]|[]
            const response = await this.productUsecase.addProduct(product,files)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Adding Product"})
        }
    }

    async updateProduct(req:Request,res:Response){
        try {
            const {productId, productData} = req.body
            const response = await this.productUsecase.updateProduct(productId, productData)
            res.status(response.status).json({message:response.message})            
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Updating Products"})
        }
    }
    
    async toggleBlock(req:Request, res:Response){
        try {
            const productId = req.body.productId
            const response = await this.productUsecase.toggleBlock(productId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Toggling status of Product"})
        }
    }

    async deleteProduct(req:Request,res:Response){
        try {
            const {productId, userId} = req.body
            const response = await this.productUsecase.deleteProduct(productId,userId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.error();
        }
    }
}
export default ProductController
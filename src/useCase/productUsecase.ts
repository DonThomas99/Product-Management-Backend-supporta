import { product, ProductResponse } from "../domain/product";
import ProductRepository from "../infrastructure/repositories/productRepository";
import Cloudinary from "../infrastructure/utils/cloudinary";
class productUsecase{
    private readonly productRepository:ProductRepository
    constructor(
        private readonly cloudinary:Cloudinary,
        productRepository:ProductRepository){
        this.productRepository = productRepository
    }
    async fetchProductByUserId(userId:string){
    try {
        const product = await this.productRepository.fetchProductById(userId)
        if(product && product.length>0){

            return {
                status:200,
                message:"Products Fetched Successfully!!!",
                data:product
            }
        }else{
            return {
                status:401,
                message:"Error Fetching Products",
                data:null
            }
        }
    } catch (error) {
        console.error(error);
        return {
            status:500,
            message:'Error Fetching Product'
        }
    }
    }

    async addProduct(product:product,files:File[]):Promise<ProductResponse>{
        try {
            if(!files || !Array.isArray(files)){
                return {
                    status:401,
                    message:"Invalid Details",
                    data:null
                }
            }
            const uploadImages = await Promise.all(
                files.map(async(file:any)=>{
                    try {
                        return await this.cloudinary.savetoCloudinary(file)
                    } catch (error) {
                        console.error('cloudinaryError',error);
                        return null
                    }
                })
            )
            let file = uploadImages.filter((file)=>file !=null)

            if(file.length === 0){
                return {
                    status:400,
                    message:'Invalid Images Found',
                    data:null
                }
            }
            const isExisting = await this.productRepository.fetchProductByName(product.name)
            if(isExisting){
                return{
                    status:309,
                    message:"product Already Exists",
                    data:null
                }
            } else{

             const save = await this.productRepository.addProduct(product,file)
             if(save){
                 return {
                     status:200,
                     message:"Product Added Successfully",
                     data:null
                    }
                }else{
                    return {
                        status:400,
                        message:"Error Adding Product",
                        data:null
                    }
                }
            }    

            
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Adding Product",
                data:null
            }

        }
    }

    async fetchAllProducts(){
        try {
            const products = await this.productRepository.fetchAllProducts()
            if( products && products.length>0){
                return {
                    status:200,
                    message:"Fetched Products Successfully",
                    data:products
                }
            }else{
                return{
                    status:400,
                    message:"Error Fetching Products",
                    data:null
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Fetching products",
                data:null
            }
        }
    }

    async toggleBlock(productId:string){
        try {
            const isExisting = await this.productRepository.fetchByProductId(productId)
            if(isExisting){
                await this.productRepository.updateProduct(productId,{isBlocked:!isExisting.isBlocked})
                return {
                    status:200,
                    message:"Product Status Toggled Successfully"
                }
            } else{
                return {
                    status:404,
                    message:"Error Fetching Product "
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Updating Data"
            }
        }
    }
    
    async updateProduct(productId:string,updateData:Partial<product>){
        try {
            const isExisting = await this.productRepository.fetchByProductId(productId)
            if(!isExisting){
                return {
                    status:404,
                    message:"Product Not Found"
                }
            }
            const update = await this.productRepository.updateProduct(productId,updateData)
            if(update){
                return{
                    status:200,
                    message:"Successfully Updated Product Details"
                }
            }else{
                return{
                    status:400,
                    message:"Error Updating product"
                }
            }
        } catch (error) {
            console.error(error);
            return{
                status:500,
                message:"Error Fetching Product"
            }
        }
    }

    async deleteProduct(productId:string,userId:string){
        try {
            const product = await this.productRepository.fetchByProductId(productId)
            if(!product){
                return {
                    status:404,
                    message:"Product Not Found",
                }
            }

            if(product.addedBy.toString() !== userId){
                return {
                    status:403,
                    message:"Unauthorized to delete this product"
                }
            }

            const deleted = await this.productRepository.deleteProduct(productId)
            if(deleted){
                return{
                    status:200,
                    message:"Product Deleted Successfully "
                }
            } else{
                return {
                    status:400,
                    message:"Error Deleting Product"
                }
            }
        } catch (error) {
            console.error(error)
            return{
                status:500,
                message:"error Deleting Product",
            }
        }
    }
}
export default productUsecase
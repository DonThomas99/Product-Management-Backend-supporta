import { product } from "../../domain/product";
import { productModel } from "../database/productModel"
class ProductRepository{
    constructor(){}
    async addProduct(product:product,files:string[]){
        try {
            const document = {
                name:product.name,
                category:product.category,
                brand:product.brand,
                images:files,
                price:product.price,
                description:product.description,
                addedBy:product.addedBy                                                                                                                                                             
            }
            const newProduct = new productModel(document)
            const savedProduct = await newProduct.save()

            const populatedProduct = await productModel
            .findById(savedProduct._id)
            .populate('Category','name')
            .populate('Brand','name')

            return populatedProduct
            
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchProductByName(name:string){
        try {
    const product = await productModel.findOne({name:name})
    return product            
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchProductById(userId:string){
        try {
                const products = await productModel.find({addedBy:userId})
                return products.length > 0 ? products : null;
            } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchAllProducts(){
        try {
            const products = await productModel
            .find({})
            .populate('Category','name')
            .populate('Brand','name')
            return products            
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async updateProduct(productId:string,updatedData:Partial<product>){
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                {$set:updatedData},
                {new:true}
            )
            return updatedProduct
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchByProductId(productId:string){
        try {
            const product = await productModel.findOne({_id:productId})
            return product
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async deleteProduct(productId:string){
        try {
            const deleteProduct = await productModel.findByIdAndDelete({_id:productId})
            return deleteProduct
        } catch (error) {
            console.error(error);
            return null
        }
    }
}
export default ProductRepository
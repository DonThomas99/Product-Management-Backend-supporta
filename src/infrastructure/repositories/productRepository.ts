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
            console.log(error);
            return null
        }
    }
}
export default ProductRepository
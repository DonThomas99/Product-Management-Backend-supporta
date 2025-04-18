import { category } from "../../domain/category";
import categoryModel from "../database/categoryModel";

class CategoryRepository{
    constructor(){}
    
    async addCategory(name:string){
        try {
            const category = new categoryModel({name:name})
            const save = await category.save()
            if(save){
                return save
            }else{
                return false
            }
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchCategory(){
        try {
            const categories = await categoryModel.find({})
            return categories
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchCategoryById(categoryId:string){
        try {
            const category = await categoryModel.findOne({_id:categoryId})
            return category
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async updateCategory(categoryId:string, updatedData:Partial<category>){
     try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            {$set:updatedData},
            {new:true}
        )
        return updatedCategory
     } catch (error) {
        console.error(error);
     }
    }

    async deleteCategory(categoryId:string){
        try {
            const deleteCategory = await categoryModel.findByIdAndDelete({_id:categoryId})
            return deleteCategory
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchCategoryByName(name:string){
        try {
            const category = await categoryModel.find({name:name})
            return  category
        } catch (error) {
            console.error(error);
            return null
        }
    }

}
export default CategoryRepository
import { category } from "../domain/category"
import CategoryRepository from "../infrastructure/repositories/categoryRepository"

class CategoryUsecase{
    private readonly categoryRepository:CategoryRepository
    constructor(categoryRepository:CategoryRepository){
        this.categoryRepository = categoryRepository
    }

    async addCategory(category:string){
        try {
            const isExisitng = await this.categoryRepository.fetchCategoryByName(category)
            if(isExisitng){
                return{
                    status:309,
                    message:"Category Already Existing !!",
                    data:null
                }
            }else{
                const addCategory = await this.categoryRepository.addCategory(category)
                if(addCategory){
                    return {
                        status:200,
                        message:"Category Added Successfully!!",
                        data:addCategory
                    }
                }else{
                    return {
                        status:400,
                        message:"Error Adding Category!!",
                        data:null
                    }
                }
            }
            
        } catch (error) {
            console.error(error);
            return{
                status:500,
                message:"Error Adding Category",
                data:null
            }
        }
    }

    async fetchAllCategories(){
        try {
            const categories = await this.categoryRepository.fetchCategory()
            if(categories && categories.length > 0){
                return{
                    status:200,
                    message:"Categories Fetched Successfully!",
                    data:categories
                }
            }else{
                return {
                    status:400,
                    message:"Error Fetching Categories",
                    data:null
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Fetching Category",
                data:null
            }
        }
    }

    async toggleBlock(categoryId:string){
        try {
            const isExisting = await this.categoryRepository.fetchCategoryById(categoryId)
            if(isExisting){
                await this.categoryRepository.updateCategory(categoryId,{isBlocked:!isExisting.isBlocked})
                return {
                    status:200,
                    message:"Category Status Toggled Successfully!",
                }
            }else{
                return{
                    status:404,
                    message:"Error Toggling Category Status "
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Toggling Category Status"
            }
        }
    }

    async updateCategory(categoryId:string,updatedData:Partial<category>){
        try {
            const isExisting = await this.categoryRepository.fetchCategoryById(categoryId)
            if(isExisting){
                const updatedCategory = await this.categoryRepository.updateCategory(categoryId,updatedData)
                if(updatedCategory){
                    return{
                        status:200,
                        message:"Category Updated Successfully",
                        data:updatedCategory
                    }
                }else{
                    return {
                        status:400,
                        message:"Error Updating Category",
                        data:null
                    }
                }
            }else{
                    return{
                    status:404,
                    message:"Category Not Found",
                    data:null
                    }
            }
        } catch (error) {
            console.error(error);
            return{
                status:500,
                message:"Error Updating Category!!",
                data:null
            }
        }
    }

    async deleteCategory(categoryId:string){
        try {
            const isExisitng = await this.categoryRepository.fetchCategoryById(categoryId)
            if(isExisitng){
                const categoryDelete = await this.categoryRepository.deleteCategory(categoryId)
                if(categoryDelete){
                    return {
                        status:200,
                        message:"Successfully Deleted Category"
                    }
                }else{
                    return {
                        status:400,
                        message:"Error Deleting Category"
                    }
                }
            }else{
                return{
                    status:404,
                    message:"Category Not Found"
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:500,
                message:"Error Deleting Category"
            }
        }
    }

}
export default CategoryUsecase
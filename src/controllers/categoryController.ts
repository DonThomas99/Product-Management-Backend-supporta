import CategoryUsecase from "../useCase/categoryUsecase"
import { Request,Response } from "express"

class CategoryController{
    private  categoryUsecase:CategoryUsecase
    constructor(categoryUsecase:CategoryUsecase){
        this.categoryUsecase = categoryUsecase
    }

    async addCategory(req:Request,res:Response){
        try {
             const categoryData = req.body
            const response = await this.categoryUsecase.addCategory(categoryData)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }
    
    async fetchCategory(req:Request,res:Response){
        try {
            const response = await this.categoryUsecase.fetchAllCategories()
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    async toggleBlock(req:Request,res:Response){
        try {
            const categoryId = req.body
            const response = await this.categoryUsecase.toggleBlock(categoryId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal server"})
        }
    }

    async updateCategory(req:Request,res:Response){
        try {
            const {categoryId, updateData} = req.body
            const response = await this.categoryUsecase.updateCategory(categoryId, updateData)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    async deleteCategory(req:Request,res:Response){
        try {
            const categoryId = req.body
            const response = await this.categoryUsecase.deleteCategory(categoryId)
            res.status(response.status).json({message:response?.message})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

}

export default CategoryController
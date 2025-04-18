import express, {Request} from "express";
import CategoryController from "../../controllers/categoryController";
import CategoryRepository from "../repositories/categoryRepository";
import CategoryUsecase from "../../useCase/categoryUsecase";
const categoryRoutes = express.Router()
const categoryRepo = new CategoryRepository()
const categoryUsecase = new CategoryUsecase(categoryRepo)
const categoryController = new CategoryController(categoryUsecase)

categoryRoutes.get('/category',(req:Request,res)=>{categoryController.fetchCategory(req,res)})
categoryRoutes.post('/category',(req:Request,res)=>{categoryController.addCategory(req,res)})
categoryRoutes.put('/category',(req:Request,res)=>{categoryController.toggleBlock(req,res)})
categoryRoutes.patch('/category',(req:Request,res)=>{categoryController.updateCategory(req,res)})
categoryRoutes.delete('/category',(req:Request,res)=>{categoryController.deleteCategory(req,res)})

export default categoryRoutes
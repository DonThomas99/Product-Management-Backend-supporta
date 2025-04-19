import express,{Request} from 'express'
import BrandRepository from '../repositories/brandRepository'
import BrandUsecase from '../../useCase/brandUsecase'
import CategoryRepository from '../repositories/categoryRepository'
import Cloudinary from '../utils/cloudinary'
import BrandController from '../../controllers/brandController'
import { singleUpload } from '../middlewares/multer'
const brandRoutes = express.Router()

const brandRepo = new BrandRepository()
const categoryRepo = new CategoryRepository()
const cloudinary = new Cloudinary()
const brandUsecase = new BrandUsecase(cloudinary,categoryRepo,brandRepo)
const brandController = new BrandController(brandUsecase)

brandRoutes.get('/brand',(req:Request,res)=>{brandController.fetchAllBrands(req,res)})
brandRoutes.post('/brand',singleUpload,(req:Request,res)=>{brandController.addBrand(req,res)})
brandRoutes.put('/brand',singleUpload,(req:Request,res)=>{brandController.updateBrand(req,res)})
brandRoutes.patch('/brand',(req:Request,res)=>{brandController.toggleBlock(req,res)})


export default brandRoutes
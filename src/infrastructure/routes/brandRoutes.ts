import express,{Request} from 'express'
import BrandRepository from '../repositories/brandRepository'
import BrandUsecase from '../../useCase/brandUsecase'
import CategoryRepository from '../repositories/categoryRepository'
import Cloudinary from '../utils/cloudinary'
import BrandController from '../../controllers/brandController'
import { logoUpload} from '../middlewares/multer'
import { userAuth } from '../middlewares/userAuth'
const brandRoutes = express.Router()

const brandRepo = new BrandRepository()
const categoryRepo = new CategoryRepository()
const cloudinary = new Cloudinary()
const brandUsecase = new BrandUsecase(cloudinary,categoryRepo,brandRepo)
const brandController = new BrandController(brandUsecase)

brandRoutes.get('/brand',userAuth,(req:Request,res)=>{brandController.fetchAllBrands(req,res)})
brandRoutes.post('/brand',userAuth,logoUpload,(req:Request,res)=>{brandController.addBrand(req,res)})
brandRoutes.put('/brand',userAuth,logoUpload,(req:Request,res)=>{brandController.updateBrand(req,res)})
brandRoutes.patch('/brand',userAuth,(req:Request,res)=>{brandController.toggleBlock(req,res)})


export default brandRoutes
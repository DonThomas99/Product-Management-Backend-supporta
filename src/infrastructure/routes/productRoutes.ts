import express,{Request} from 'express'
import JwtCreate from '../utils/jwtCreate'
import ProductRepository from '../repositories/productRepository'
import productUsecase from '../../useCase/productUsecase'
import Cloudinary from '../utils/cloudinary'
import ProductController from '../../controllers/productController'
import { Multer } from '../middlewares/multer'
import validateBrandAndCategory  from '../middlewares/validateBrandAndCategory'

const productRoutes = express.Router()
const jwt = new JwtCreate()

const productRepo = new ProductRepository()
const cloudinary = new Cloudinary()
const productCase = new productUsecase(cloudinary,productRepo)
const productController = new ProductController(productCase)

productRoutes.get('/productById',(req:Request,res)=>{productController.fetchProductByUserId(req,res)})
productRoutes.post('/product', Multer,validateBrandAndCategory,(req: Request, res)=>{productController.addProduct(req, res);});
productRoutes.patch('/product',(req:Request,res)=>{productController.updateProduct(req,res)})
productRoutes.put('/product',(req:Request,res)=>{productController}) 


export default productRoutes
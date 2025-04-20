import express,{Request} from 'express'
import JwtCreate from '../utils/jwtCreate'
import ProductRepository from '../repositories/productRepository'
import productUsecase from '../../useCase/productUsecase'
import Cloudinary from '../utils/cloudinary'
import ProductController from '../../controllers/productController'
import { Multer } from '../middlewares/multer'
import validateBrandAndCategory  from '../middlewares/validateBrandAndCategory'
import { userAuth } from '../middlewares/userAuth'

const productRoutes = express.Router()
const jwt = new JwtCreate()

const productRepo = new ProductRepository()
const cloudinary = new Cloudinary()
const productCase = new productUsecase(cloudinary,productRepo)
const productController = new ProductController(productCase)

productRoutes.get('/productById',userAuth,(req:Request,res)=>{productController.fetchProductByUserId(req,res)})
productRoutes.get('/product',userAuth,(req:Request,res)=>{productController.fetchAllProducts(req,res)})
productRoutes.post('/product',userAuth, Multer,validateBrandAndCategory,(req: Request, res)=>{productController.addProduct(req, res);});
productRoutes.patch('/product',userAuth,(req:Request,res)=>{productController.updateProduct(req,res)})
productRoutes.put('/product',userAuth,(req:Request,res)=>{productController.toggleBlock(req,res)})
productRoutes.delete('/product',userAuth,(req:Request,res)=>{productController.deleteProduct(req,res)}) 


export default productRoutes
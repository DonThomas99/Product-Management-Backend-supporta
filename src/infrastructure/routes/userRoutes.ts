import express,{Request} from 'express'
import UserRepository from '../repositories/userRepository'
import UserUsecase from '../../useCase/userUsecase'
import Cloudinary from '../utils/cloudinary'
import JwtCreate from '../utils/jwtCreate'
import Encrypt from '../utils/hashPassword'
import UserController from '../../controllers/userController'
import { userAuth } from '../middlewares/userAuth'
const userRoutes = express.Router()

const userRepo = new UserRepository()
const cloudinary = new Cloudinary()
const jwtCreate = new JwtCreate()
const encrypt = new Encrypt()
const userUsecase = new UserUsecase(cloudinary,encrypt,jwtCreate,userRepo)
const userController = new UserController(userUsecase)

userRoutes.post('/user',(req:Request,res)=>{userController.userSignup(req,res)})
userRoutes.post('/userLogin',(req:Request,res)=>{userController.userSignup(req,res)})
userRoutes.put('/user',userAuth,(req:Request,res)=>{userController.blockUser(req,res)})
userRoutes.patch('/user',userAuth,(req:Request,res)=>{userController.unblockUser(req,res)})
userRoutes.post('/updateUser',userAuth,(req:Request,res)=>{userController.updateUser(req,res)})

export default userRoutes
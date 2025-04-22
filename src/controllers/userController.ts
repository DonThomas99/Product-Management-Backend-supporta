import { Request, Response } from "express";
import UserUsecase from "../useCase/userUsecase"
import { IuserLogin, user, userSignUp } from "../domain/user";

class UserController{
    private userUsecase:UserUsecase
    constructor(userUsecase:UserUsecase){
        this.userUsecase = userUsecase
    }

    async userSignup(req:Request,res:Response){
        try {
            let userData:user
            userData = req.body
            const file = req.file as Express.Multer.File
            const response = await this.userUsecase.userSignUp(userData,file)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error from controller"})
        }
    }

    async userLogin(req:Request,res:Response){
        try {
            let user:IuserLogin
            user = req.body
            const response = await this.userUsecase.userLogin(user)
            res.status(response.status).json({messge:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:'Internal Server Error'})
        }
    }

    async blockUser(req:Request,res:Response){
        try {
            const {userId,targetUserId} = req.body
            const response = await this.userUsecase.blockUser(userId,targetUserId)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    async unblockUser(req:Request,res:Response){
        try {
            const {userId,targetUserId} = req.body
            const response = await this.userUsecase.unblockUser(userId,targetUserId)
            res.status(response.status).json({message:response.status,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    async updateUser(req:Request,res:Response){
        try {
            const userId = req.params.userId;
            const userData = req.body;
            const file = req.file; 

            const response = await this.userUsecase.updateUserProfile(userId, userData, file);

            return res.status(response.status).json({message: response.message,data: response.data});
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }
    
}

export default UserController
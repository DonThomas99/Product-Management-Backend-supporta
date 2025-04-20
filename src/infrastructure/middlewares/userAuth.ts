import {Request, Response, NextFunction} from "express"
import jwt,{ JwtPayload } from "jsonwebtoken"
import UserRepository from "../repositories/userRepository"

const userRepo = new UserRepository()

export const userAuth = async(req:Request, res:Response, next:NextFunction )=>{
        try {
            const token = req.headers.authorization;
                if(token){
                    const decode = jwt.verify(token.slice(7),process.env.JWT_KEY as string) as JwtPayload
                    const userData = await userRepo.fetchUserById(decode.id)
                    if(userData){
                            next()
                    }else{
                        res.status(404).json({message:"Invalid User"})
                    }
                }else{
                    res.status(401).json({message:"User is not Logged In"})
                }
        } catch (error) {
            console.error(error)
        }
    }

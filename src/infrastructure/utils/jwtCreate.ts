import Ijwt from "../../useCase/interfaces/jwt";
import jwt from "jsonwebtoken"

class JwtCreate implements Ijwt{
    createJwt(Id: string): string {
    const jwtKey =  process.env.JWT_KEY
    if(jwtKey){
        const token:string = jwt.sign({id:Id},jwtKey)
    return token
    }
    throw new Error("JWT_KEY is not defined")
    }
    generateRefreshToken(id:string):string{
        const key = process.env.JWT_KEY
        if(key){
            const exp = Math.floor(Date.now()/1000) + (24*60*60)
            return jwt.sign({id:id,iat:Date.now()/1000},key)
        }
        throw new Error("JWT Key is not defined")
    }
}

export default JwtCreate
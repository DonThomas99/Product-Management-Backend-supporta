import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserRepository from "../repositories/userRepository";

const userRepo = new UserRepository();

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

            const userData = await userRepo.fetchUserById(decoded.id);

            if (userData) {
                next();
            } else {
                res.status(404).json({ message: "Invalid User" });
            }
        } else {
            res.status(401).json({ message: "User is not Logged In" });
        }
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

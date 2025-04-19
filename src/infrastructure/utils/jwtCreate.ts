import Ijwt from "../../useCase/interfaces/jwt";
import jwt from "jsonwebtoken";

class JwtCreate implements Ijwt {

    // Method required by Ijwt interface
    createJwt(userId: string, role: string): string {
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        if (accessSecret) {
            return jwt.sign({ id: userId, role }, accessSecret, { expiresIn: "15m" });
        }
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    generateAccessToken(userId: string): string {
        return this.createJwt(userId, "user"); // default role "user", or pass dynamic role
    }

    generateRefreshToken(userId: string): string {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (refreshSecret) {
            return jwt.sign({ id: userId }, refreshSecret, { expiresIn: "7d" });
        }
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    verifyToken(token: string, type: 'access' | 'refresh'): any {
        const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
        if (secret) {
            return jwt.verify(token, secret);
        }
        throw new Error(`${type.toUpperCase()}_TOKEN_SECRET is not defined`);
    }
}

export default JwtCreate;

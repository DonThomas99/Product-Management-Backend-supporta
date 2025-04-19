import { IuserLogin, user, userSignUp } from "../domain/user"
import UserRepository from "../infrastructure/repositories/userRepository"
import Cloudinary from "../infrastructure/utils/cloudinary"
import Encrypt from "../infrastructure/utils/hashPassword"
import JwtCreate from "../infrastructure/utils/jwtCreate"

class UserUsecase {
    private userRepository: UserRepository
    private cloudinary: Cloudinary
    private JwtCreate: JwtCreate
    private Encrypt: Encrypt

    constructor(
        cloudinary: Cloudinary,
        Encrypt: Encrypt,
        jwtCreate: JwtCreate,
        userRepository: UserRepository
    ) {
        this.userRepository = userRepository
        this.cloudinary = cloudinary
        this.Encrypt = Encrypt
        this.JwtCreate = jwtCreate
    }

    async userSignUp(userData: user, file: Express.Multer.File) {
        try {
            if (!file) {
                return {
                    status: 401,
                    message: "Invalid Image",
                    data: null
                }
            }

            const uploadedImage = await this.cloudinary.savetoCloudinary(file)
            if (!uploadedImage) {
                return {
                    status: 400,
                    message: "Invalid Image",
                    data: null
                }
            }

            const hashedPassword = await this.Encrypt.createHash(userData.password)
            const isExisting = await this.userRepository.fetchUserByEmail(userData.email)

            if (isExisting) {
                return {
                    status: 409,
                    message: "User Email Already Exists",
                    data: null
                }
            }

            const saveUser: userSignUp = {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                profilePhoto: uploadedImage
            }

            const save = await this.userRepository.addUser(saveUser)
            return {
                status: 200,
                message: "User Added Successfully",
                data: save
            }
        } catch (error) {
            console.error(error)
            return {
                status: 500,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async userLogin(userLoginData: IuserLogin) {
        try {
            const isExisting = await this.userRepository.fetchUserByEmail(userLoginData.email)
            if (!isExisting) {
                return {
                    status: 404,
                    message: "User does not exist",
                    data: null
                }
            }

            const validatePassword = await this.Encrypt.compare(userLoginData.password, isExisting.password)
            if (!validatePassword) {
                return {
                    status: 401,
                    message: "Invalid Password",
                    data: null
                }
            }

            const accessToken = this.JwtCreate.generateAccessToken(isExisting._id.toString())
            const refreshToken = this.JwtCreate.generateRefreshToken(isExisting._id.toString())

            const refreshTokenExpiresAt = new Date()
            refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7)

            await this.userRepository.updateUser(isExisting._id.toString(), {
                refreshToken,
                refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
            })

            return {
                status: 200,
                message: "Login successful",
                data: {
                    userId: isExisting._id,
                    name: isExisting.name,
                    email: isExisting.email,
                    profilePhoto: isExisting.profilePhoto,
                    accessToken,
                    refreshToken
                }
            }
        } catch (error) {
            console.error(error)
            return {
                status: 500,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            if (!refreshToken) {
                return {
                    status: 401,
                    message: "No refresh token provided",
                    data: null
                }
            }

            const decoded = this.JwtCreate.verifyToken(refreshToken,"refresh")
            if (!decoded) {
                return {
                    status: 403,
                    message: "Invalid refresh token",
                    data: null
                }
            }

            const user = await this.userRepository.fetchUserById(decoded.id)
            if (!user || user.refreshToken !== refreshToken) {
                return {
                    status: 403,
                    message: "Refresh token mismatch or user not found",
                    data: null
                }
            }

            const newAccessToken = this.JwtCreate.generateAccessToken(user._id.toString())
            const newRefreshToken = this.JwtCreate.generateRefreshToken(user._id.toString())

            const newExpiry = new Date()
            newExpiry.setDate(newExpiry.getDate() + 7)

            await this.userRepository.updateUser(user._id.toString(), {
                refreshToken: newRefreshToken,
                refreshTokenExpiresAt: newExpiry.toISOString()
            })

            return {
                status: 200,
                message: "New access token generated",
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            }
        } catch (error) {
            console.error(error)
            return {
                status: 500,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async updateUserProfile(userId: string, userData: Partial<user>, file?: Express.Multer.File) {
        try {
          
            if (file) {
                const uploadedImage = await this.cloudinary.savetoCloudinary(file);
                if (!uploadedImage) {
                    return {
                        status: 400,
                        message: "Image upload failed",
                        data: null
                    };
                }
                userData.profilePhoto = uploadedImage;
            }
    
            const updatedUser = await this.userRepository.updateUser(userId, userData);
    
            if (!updatedUser) {
                return {
                    status: 404,
                    message: "User not found or update failed",
                    data: null
                };
            }
    
            return {
                status: 200,
                message: "User updated successfully",
                data: updatedUser
            };
    
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Internal Server Error",
                data: null
            };
        }
    }
    

async blockUser(userId: string, targetUserId: string) {
    try {
        if (userId === targetUserId) {
            return {
                status: 400,
                message: "You cannot block yourself.",
                data: null
            }
        }

        const updated = await this.userRepository.blockUser(userId, targetUserId);
        if (!updated) {
            return {
                status: 500,
                message: "Unable to block user",
                data: null
            }
        }

        return {
            status: 200,
            message: "User blocked successfully",
            data: updated
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async unblockUser(userId: string, targetUserId: string) {
    try {
        const updated = await this.userRepository.unblockUser(userId, targetUserId);
        if (!updated) {
            return {
                status: 500,
                message: "Unable to unblock user",
                data: null
            }
        }

        return {
            status: 200,
            message: "User unblocked successfully",
            data: updated
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}


}

export default UserUsecase

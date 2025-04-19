import mongoose from "mongoose";
import { user, userSignUp } from "../../domain/user";
import userModel from "../database/userModel";

class UserRepository{
    constructor(){}
    async addUser(user:userSignUp){
        try {
            const document = new userModel( {
                name:user.name,
                email:user.email,
                profilePhoto:user.profilePhoto,
                password:user.password
            })
            const save = await document.save()
            const populatedUser = await userModel
            .findById(save._id)
            return populatedUser
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async updateUser(userId:string,userData:Partial<user>){
        try {
            const user= await userModel.findByIdAndUpdate(
                userId,
                {$set:userData},
                {new:true}
            )
            return user
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchUserByEmail(userEmail:string){
        try {
            const user = await userModel.findOne({email:userEmail})
            return user
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async fetchUserById(userId:string){
        try {
        const user = await userModel.findById(userId)
        return user            
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async blockUser(userId: string, targetUserId: string) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $addToSet: { blockedUsers: targetUserId } }, // prevent duplicates
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    async unblockUser(userId: string, targetUserId: string) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $pull: { blockedUsers: targetUserId } },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    
    async getBlockedUsers(userId: string): Promise<string[] | null> {
        try {
            const user = await userModel.findById(userId).select("blockedUsers");
            if (!user || !user.blockedUsers) return [];
    
            const blockedUserIds = user.blockedUsers.map((id: mongoose.Types.ObjectId) => id.toString());
            return blockedUserIds;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    

}
export default UserRepository
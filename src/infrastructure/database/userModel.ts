import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        select:false
    },
    refreshTokenExpiresAt:{
        type:Date,
        select:false,
    },
    blockedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{
    timestamps:true
})

const userModel = mongoose.model('User',userSchema)
export default userModel
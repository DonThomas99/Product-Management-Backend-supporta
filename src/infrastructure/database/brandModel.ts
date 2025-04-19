import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brandLogo:{
        type:String,
        required:true  
    },
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }],
    isBlocked:{
        type:Boolean,
        default:false
    }
})

const brandModel = mongoose.model('Brand',brandSchema)
export default brandModel
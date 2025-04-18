import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,ref:'Brand',
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    images:{
        type: [String],  
        validate: [(val: string[]) => val.length <= 4, '{PATH} exceeds the limit of 4']
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


export const productModel = mongoose.model('product',productSchema)
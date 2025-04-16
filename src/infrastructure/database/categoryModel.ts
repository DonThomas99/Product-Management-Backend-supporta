import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isBlocked:{
        type:String,
        required:true
    }
},{timestamps:true})

const categoryModel = mongoose.model('Category',categorySchema)
export default categoryModel
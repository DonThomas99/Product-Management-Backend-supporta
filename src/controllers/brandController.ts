import { IBrandInput } from "../domain/brand"
import BrandUsecase from "../useCase/brandUsecase"
import {Request,Response} from"express"
class BrandController{
private brandUsecase:BrandUsecase
    constructor(brandUsecase:BrandUsecase){
        this.brandUsecase = brandUsecase
    }
    async fetchAllBrands(req:Request,res:Response){
        try {
            const response = await this.brandUsecase.fetchAllBrands()
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Error Fetching Brands",data:null})            
        }
    }

    async addBrand(req:Request, res:Response){
        try {
            let brand:IBrandInput
            brand = req.body
            const file = req.file as Express.Multer.File
            const response = await  this.brandUsecase.addBrand(brand,file)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Error Saving Brand"})
        }
    }

    async updateBrand(req:Request, res:Response){
        try {
            const {brandId,updateData} = req.body
            const response = await this.brandUsecase.updateBrand(brandId,{    ...updateData,
                addCategories: req.body.addCategories?.split(",") || [],
                removeCategories: req.body.removeCategories?.split(",") || [],
                brandLogo: req.file ?? undefined, })
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    async toggleBlock(req:Request, res:Response){
        try {
            const {brandId} = req.body
            const response = await this.brandUsecase.toggleBlock(brandId)
            res.status(response.status).json({message:response.message,data:response.data})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Internal Server Error"})
        }
    }
}
export default BrandController

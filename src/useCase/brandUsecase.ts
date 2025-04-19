import { IBrandInput } from "../domain/brand"
import BrandRepository from "../infrastructure/repositories/brandRepository"
import CategoryRepository from "../infrastructure/repositories/categoryRepository"
import Cloudinary from "../infrastructure/utils/cloudinary"
import { Types } from "mongoose"

class BrandUsecase{
    private brandRepository:BrandRepository
    private categoryRepository:CategoryRepository
    constructor(
        private readonly cloudinary:Cloudinary,
        categoryRepository:CategoryRepository,
        brandRepostiory:BrandRepository
    ){
        this.brandRepository = brandRepostiory
        this.categoryRepository = categoryRepository
    }

    async fetchAllBrands(){
        try {
            const brands = await this.brandRepository.fetchAllBrands()
            if(brands && brands.length > 0){
                return {
                    status:200,
                    message:"Brands Fetched successfully"
                }
            }else{
                return{
                    status:404,
                    message:"Error Fetching Brands"
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status:400,
                message:"Error Fetching Brands",
                data:null
            }
        }
    }

    async addBrand(brand:IBrandInput, file:Express.Multer.File){
        try {
            if(!file){
             return{
                   status:401,
                message:"Invalid Details",
                data:null
             }
            }
            const uploadImage = await this.cloudinary.savetoCloudinary(file)
            if(!uploadImage){
                return {
                    status:500,
                    message:"Failed Uploading Brand Logo",
                    data:null
                }
            }
            const isExisting = await this.brandRepository.fetchBrandByName(brand.name)
            if(isExisting){
                return {
                    status:309,
                    message:"Brand Already Exists",
                    data:null
                }
            }else{
                    const save = await this.brandRepository.addBrand(brand,uploadImage)
                    if(save){
                        return{
                            status:201,
                            message:"Brand Added Successfully!!",
                            data:save
                        }
                    }else{
                        return{
                            status:500,
                            message:"Failed To Create Brand",
                            data:null
                        }
                    }
            }
        } catch (error) {
         console.error(error);
         return{
            status:500,
            message:"Error Saving Brand",
            data:null
         }   
        }        
    }

    async toggleBlock(brandId:string){
        try {
            const isExisting = await this.brandRepository.fetchBrandById(brandId)
            if(isExisting){
                    const update = await this.brandRepository.updateBrand(brandId,{isBlocked:!isExisting.isBlocked})
                    if(update){
                        return {
                            status:200,
                            message:"Brand Status Toggled successfully",
                            data:update
                        }
                    }else{
                        return{
                            status:400,
                            message:"Error Toggling Brand Status",
                            data:null
                        }
                    }
            }else{
                    return{
                        status:404,
                        message:"Brand Not Found",
                        data:null
                    }
            }
        } catch (error) {
            console.error(error);
            return{
                status:500,
                message:"Error Toggling Brand Status"
            }
        }
    }

    async updateBrand(
        brandId: string,
        updateBrand: Partial<IBrandInput> & {
          addCategories?: string[];
          removeCategories?: string[];
          brandLogo?: Express.Multer.File;
        }
      ) {
        try {
          const isExisting = await this.brandRepository.fetchBrandById(brandId);
          if (!isExisting) {
            return {
              status: 404,
              message: "Brand Not Found",
              data: null,
            };
          }
      
          const UpdatedData: Partial<IBrandInput> = { ...updateBrand };
          let logoUrl: string | null;
      
          if (updateBrand.brandLogo) {
            logoUrl = await this.cloudinary.savetoCloudinary(updateBrand.brandLogo);
            if (!logoUrl) {
              return {
                status: 500,
                message: "Failed To Upload Brand Logo",
                data:null
              };
            }
            UpdatedData.brandLogo = logoUrl;
          }
      
          let currentCategoryIds: Types.ObjectId[] =
            isExisting.category?.map((c) => new Types.ObjectId(c.toString())) || [];
      
          // ADD Categories
          if (updateBrand.addCategories && updateBrand.addCategories.length > 0) {
            const validCategories = await Promise.all(
              updateBrand.addCategories.map(async (categoryId) => {
                const category = await this.categoryRepository.fetchCategoryById(categoryId);
                return category ? category._id : null;
              })
            );
            const filteredValidCategoryIds = validCategories.filter(
              (id): id is Types.ObjectId => id !== null
            );
      
            currentCategoryIds = [
              ...currentCategoryIds,
              ...filteredValidCategoryIds.filter(
                (id) => !currentCategoryIds.some((existingId) => existingId.equals(id))
              ),
            ];
          }
      
          if (updateBrand.removeCategories && updateBrand.removeCategories.length > 0) {
            currentCategoryIds = currentCategoryIds.filter(
              (catId) => !updateBrand.removeCategories!.includes(catId.toString())
            );
          }
      
          UpdatedData.category = currentCategoryIds;
      
          const updatedBrand = await this.brandRepository.updateBrand(brandId, UpdatedData);
      
          if (!updatedBrand) {
            return {
              status: 404,
              message: "Brand not found",
              data: null,
            };
          }
      
          return {
            status: 200,
            message: "Brand updated successfully",
            data: updatedBrand,
          };
        } catch (error) {
          console.error(error);
          return {
            status: 500,
            message: "Error Updating Brand",
            data:null
          };
        }
      }

}
export default BrandUsecase
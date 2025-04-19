import { Types } from "mongoose";
import { IBrandInput, IBrandOutput } from "../../domain/brand";
import brandModel from "../database/brandModel";
class BrandRepository {
    constructor() {}
  
    async addBrand(brand: IBrandInput,file:string): Promise<IBrandOutput | null> {
      try {
        const newBrand = new brandModel({
          name: brand.name,
          category: brand.category,
          brandLogo:file
        });
  
        const savedBrand = await newBrand.save();
        const populatedbrand = await brandModel
        .findById(savedBrand._id)
        .populate('Category','name')
        return populatedbrand as IBrandOutput;
      } catch (error) {
        console.error("Error adding brand:", error);
        return null;
      }
    }

    async updateBrand(
      brandId: string,
      updateData: Partial<IBrandInput> & {
        addCategories?: string[];
        removeCategories?: string[];
        brandLogo?: string;
      }
    ): Promise<IBrandOutput | null> {
      try {
        const updateOps: any = {};
  
        // Set name or brandLogo if available
        if (updateData.name) updateOps["$set"] = { ...(updateOps["$set"] || {}), name: updateData.name };
        if (updateData.brandLogo) updateOps["$set"] = { ...(updateOps["$set"] || {}), brandLogo: updateData.brandLogo };
        if (typeof updateData.isBlocked === 'boolean') updateOps["$set"] = { ...(updateOps["$set"] || {}), isBlocked: updateData.isBlocked };
  
        // Remove categories
        if (updateData.removeCategories?.length) {
          updateOps["$pull"] = {
            ...(updateOps["$pull"] || {}),
            category: { $in: updateData.removeCategories.map(id => new Types.ObjectId(id)) }
          };
        }
  
        // Add categories
        if (updateData.addCategories?.length) {
          updateOps["$addToSet"] = {
            ...(updateOps["$addToSet"] || {}),
            category: { $each: updateData.addCategories.map(id => new Types.ObjectId(id)) }
          };
        }
  
        // If there's nothing to update
        if (Object.keys(updateOps).length === 0) return await brandModel.findById(brandId).populate('category');
  
        // Apply updates
        await brandModel.findByIdAndUpdate(brandId, updateOps);
  
        // Return updated brand
        return await brandModel.findById(brandId).populate('category');
      } catch (error) {
        console.error("Error updating brand:", error);
        return null;
      }
    }

    async fetchAllBrands(){
      try {
    const brands = await brandModel.find({})
    return brands
      } catch (error) {
        console.error(error);
        return null
      }
    }

    async fetchBrandById(brandId:string){
      try {
        const brand = await brandModel.findById(brandId)
        return brand
      } catch (error) {
        console.error(error);
        return null
      }
    }
    
    async fetchBrandByName(brandName:string){
      try {
        const brand = await brandModel.findOne({name:brandName})
        return brand
      } catch (error) {
        console.error(error);
        return null
      }
    }

  }
  
  export default BrandRepository;
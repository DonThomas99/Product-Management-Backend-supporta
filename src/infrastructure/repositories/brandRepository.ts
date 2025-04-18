import { IBrandInput, IBrandOutput } from "../../domain/brand";
import brandModel from "../database/brandModel";
class BrandRepository {
    constructor() {}
  
    async addBrand(brand: IBrandInput): Promise<IBrandOutput | false> {
      try {
        const newBrand = new brandModel({
          name: brand.name,
          category: brand.category,
        });
  
        const savedBrand = await newBrand.save();
        return savedBrand as IBrandOutput;
      } catch (error) {
        console.error("Error adding brand:", error);
        return false;
      }
    }
  }
  
  export default BrandRepository;
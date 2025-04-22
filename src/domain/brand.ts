import { Types } from "mongoose";

// Define types if not already defined
export interface IBrandInput {
    name: string;
    category: Types.ObjectId[];
    brandLogo:string;
    isBlocked:boolean;
  }
  
 export interface IBrandOutput {
    _id: Types.ObjectId;
    name: string;
    brandLogo:string;
    category: Types.ObjectId[];
    isBlocked: boolean;
  }
  
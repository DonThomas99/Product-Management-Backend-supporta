import { Types } from "mongoose";

// Define types if not already defined
export interface IBrandInput {
    name: string;
    category: Types.ObjectId[]; // or string[] depending on how you handle them
  }
  
 export interface IBrandOutput {
    _id: Types.ObjectId;
    name: string;
    category: Types.ObjectId[];
    isBlocked: boolean;
  }
  
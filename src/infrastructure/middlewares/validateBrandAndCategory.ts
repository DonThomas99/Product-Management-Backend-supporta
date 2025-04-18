import { Request, Response, NextFunction } from "express";
import brandModel from "../database/brandModel";
import { Types } from "mongoose";

interface ICategory {
  _id: Types.ObjectId;
  name: string;
}

const validateBrandAndCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { brand, category } = req.body;

  try {
    const brandDoc = await brandModel.findOne({
      _id: brand,
      isBlocked: false,
    }).populate<{ category: ICategory[] }>("category");

    if (!brandDoc) {
      res.status(404).json({
        error: "Brand not found or blocked",
      });
      return; // ✅ No return of the `Response` object itself
    }

    const isValidCategory = brandDoc.category.some(
      (cat) => cat._id.toString() === category
    );

    if (!isValidCategory) {
      res.status(400).json({
        error: "Category does not belong to the selected brand",
        validCategories: brandDoc.category.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
      });
      return;
    }

    next(); 
  } catch (err) {
    res.status(500).json({ message: "Validation failed", error: err });
  }
};

export default validateBrandAndCategory;

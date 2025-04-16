export interface product{
    name:string;
    category:string;
    brand:string;
    images:string[];
    description:string;
    price:number;
    addedBy:string
}

export interface Oproduct{
    _id:string;
    name:string;
    category:string;
    brand:string;
    images:string[];
    description:string;
    price:number;
    addedBy:string
    createdAt:string;
    updatedAt:string;
}
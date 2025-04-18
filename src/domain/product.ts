export interface product{
    name:string;
    category:string;
    brand:string;
    images:string[];
    description:string;
    price:number;
    addedBy:string;
    isBlocked:Boolean;
}

export interface Oproduct{
    _id:string;
    name:string;
    category:string;
    brand:string;
    images:string[];
    description:string;
    price:number;
    addedBy:string;
    isBlocked:Boolean;
    createdAt:string;
    updatedAt:string;
}

export interface ProductResponse{
    status:number;
    message:string;
    data:any|null
}
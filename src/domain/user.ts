export interface user{
name:string;
email:string;
password:string;
profilePhoto:string;
refreshToken:string;
refreshTokenExpiresAt:string;
}

export interface userSignUp{
    name:string;
email:string;
password:string;
profilePhoto:string;
}

export interface Ouser{
    _id:string;
    name:string;
    email:string;
    password:string;
    profilePhoto:string;
}

export interface IuserLogin{
    email:string,
    password:string
}

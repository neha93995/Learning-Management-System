import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken"
import {config} from "dotenv";
config();
const isLoggedIn=(req,res,next)=>{
    const {token} = req.cookies;

    if(!token)
    {
        return next(new AppError("Unauthenticated , please login again",400));

    }


    const userDetail =  jwt.verify(token, process.env.SECRET);
    req.user = userDetail;
    next();
}

const authorizedRoles = (...roles)=>async(req, res, next)=>{

    const currentUserRoles = req.user.role;
    console.log(roles)
    console.log('--------',currentUserRoles);
    if(roles.includes(currentUserRoles))
    {
        return next(new AppError("you do not have permisstion to access this route",300));
    }

    next();
}


export {
    isLoggedIn,
    authorizedRoles
}
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js"
import cloudinary from "cloudinary";
import sendEmail  from "../utils/sendEmail.js";
// import fs from 'fs/promises';
import crypto from 'crypto';


const register= async(req,res,next)=>{
    console.log("----hello")
    const {fullName, email, password,role} = req.body;
    console.log(fullName,email,password, role)

    if(!fullName || !email || !password )
    {
        return next(new  AppError('All fields are required',400)); // generic error handler define in app.js
    }

    const userExists = await User.findOne({email});
    if(userExists)
    {
        return next(new AppError("-- Email already exists"),400);
    }
    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:"abc"
        }
    });
    
    console.log("sdfsdfsdf",userExists)
    if(!user)
    {
        return next(new AppError('User registration failed, please try again ',400));
    }
    
    if(role)
    {
        user.role = role;
    }
    
    // file upload

    if(req.file)
    {
        console.log('--------',req.file);
        try {
            
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"lms",
                width:250,
                height:250,
                gravity:'faces',
                crop:"fill"
            });

            if(result)
            {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url=result.secure_url;

                // remove file from server or local

                fs.rm(`uploads/${req.file.filename}`)


            }
        } catch (error) {

            new AppError(error || 'File not uploaded, please try again ',500);
            
        }
    }

    await user.save();
    user.password = undefined;

    await user.generateJWTToken();
    console.log("---------------------------")
    res.status(200).json({
        success:true,
        message:"User registered successfully",
        user
    })




};

const login= async(req,res,next)=>{
    
    try {
        
        const {email, password}=req.body;
    
        if(!email || !password)
        {
            return next(new AppError('All fields are required',400));
        }
    
        // explicitly take password from database
    
        const user = await User.findOne({
            email
        }).select('+password');
    
    
        console.log(password);
        console.log(user)

        if(!user || !(await user.comparePassword(password)))
        {
            return next(new AppError('Email or password does not match',400));
        }
      
    
        const token =  user.generateJWTToken();
        user.password = undefined;
        console.log("token", token);

        const cookieOptions = {
            maxAge:7*24*60*60*1000,  // for 7 days
            httpOnly:true,
            // secure:true
        }
        

        res.cookie('token',token,cookieOptions);
        res.status(200).json({
            success:true,
            message:"User loged in successfully "
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
        
    }




};


const logout=(req,res,next)=>{

    try {
        res.cookie('token',null,{
            secure:true,
            maxAge:0,
            httpOnly:true
        });
    
        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
        
    } catch (error) {
        return next(new AppError(error.message,400));
    }
    
};


const getProfile=async(req,res)=>{
    
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        res.status(200).json({
            success:true,
            message:"User details",
            user
        });



    } catch (error) {
        
        return next(new AppError("failed to fetch profile",400));
    }


};



const forgotPassword= async (req,res,next)=>{

    const {email} = req.body;

    if(!email)
    {
        return next(new AppError('---email is required',400));
    }
    
    const user = await User.findOne({email});
    
    if(!user)
    {
        return next(new AppError('email does not exits',400));
        
    }
    
  
    const resetToken = await user.generatePasswordResetToken();
    
    await user.save();

    const resetPasswordURL =  `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(resetPasswordURL);
   
    const subject = "Reset Password";
    const message =` you can reset your password by clicking <a href=${resetPasswordURL} target="_black">link</a>`;

    try {
        await sendEmail(email,subject, message);
        
        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successully`
        })
    } catch (error) {

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();
        return next(new AppError(error.message,500));
        
    }

};


const resetPassword= async (req,res,next)=>{

    const {resetToken} = req.params;
    let {password} = req.body;

    const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    });


    if(!user)
    {
        return next(
            new AppError('token is unvalid or expired please try again ', 400)
        )
    }

    user.password = password;
    user.forgotPasswordToken= undefined;
    user.forgotPasswordExpiry = undefined;

    user.save();

    res.status(200).json({
        success:true,
        message:"password changed successfully"
    })




};


const changePassword = async (req, res, next)=>{
    const {oldPassword, newPassword} = req.body;

    const {id} = req.user;

    if(!oldPassword || !newPassword)
    {
        return next(new AppError('all fields are mandantory',400));
    }

    const user = await User.findById(id).select('+password');
    console.log(id);
    console.log(user);

    if(!user)
    {
        return next(new AppError('user does not exist',400))
    }
    
    const isPasswordValid = await user.comparePassword(oldPassword);
    
    if(!isPasswordValid)
    {
        return next(new AppError('invalid password',400))

    }
    user.password = newPassword;
    await user.save();
     
    user.password = undefined;
    res.status(200).json({
        success:true,
        message:"password changed successfully"
    })

};


const updateUser = async(req, res, next)=>{
    const {fullName} = req.body;
    const id = req.user.id;

    // console.log(fullName,"---- ",id)
    const user = await User.findById(id);

    // console.log(user)

    if(!user)
    {
        return next(new AppError('user does not exist',400))
    }

    if(user.fullName)
    {
        user.fullName = fullName;
        // console.log(fullName,"---- ",id,user.fullName);
    }
    
    if(!user.file)
    {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"lms",
                width:250,
                height:250,
                gravity:'faces',
                crop:"fill"
            });

            if(result)
            {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url=result.secure_url;

                // remove file from server or local
                
                fs.rm(`uploads/${req.file.filename}`)
                
                
            }
        } catch (error) {
            
            new AppError(error || 'File not uploaded, please try again ',500);
            
        }

        console.log(user);
        await user.save();
        res.status(200).json({
            success:true,
            message:"user updated successfully"
        })
    }


}
// we are exports multiple methods that's why we can not use export default
export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser   
}
// bhai kya ho gaya yaar kuchh to boliye mujhe kuchh samjh nhi aa raha message kijiye whatsapp pr 
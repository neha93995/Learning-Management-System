import AppError from "../utils/error.util.js";
import User from "../models/user.model.js"
import cloudinary from "cloudinary";
import sendEmail  from "../utils/sendEmail.js";


const register= async(req,res,next)=>{
    console.log("----hello")
    const {fullName, email, password} = req.body;
    console.log(fullName,email,password)

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
    
    
        if(!user || !user.comparePassword(password))
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

    console.log(email);
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

    const resetPasswordURL =  `${process.env.FRONTED_URL}/reset-password/${resetToken}`;
    
    const subject = "Reset Password";
    const message =` you can reset your password by clicking <a href=${resetPasswordURL} target="_black">linke</a>`;

    try {
        await  sendEmail(email,subject, message);
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


const resetPassword=(req,res,next)=>{

};


// we are exports multiple methods that's why we can not use export default
export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword
}
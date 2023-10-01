import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { config } from "dotenv";
config();


const userSchema = new Schema({

    

    fullName:{
        type:"String",
        required:[true, "Name is required"],
        maxLength:[20,"Name should be less than 50 character"],
        lowercase:true,
        trim:true
    },
    email:{
        type:"String",
        required:[true, "Email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        // match:[
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     'Please fill in a valid email address',
        // ]
        

    },
    password:{
        type:"String",
        required:[true, "password is required"],
        minLength:[8, "Password must be at least 8 character"],
        select:false // only explicitly  return don't return when user information is get 
       

    },
    avatar:{
        public_id:{
            type:"String"

        },
        secure_url:{
            type:"String"
        }
    },
    role:{
        type:'String',
        // enum:['USER','ADMIN'],
        default:''
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    subscription:{
        id:"String",
        currentStatus:"String"

    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    console.log("hdsfsdfj ")

    
})

userSchema.methods = {
    generateJWTToken(){
        console.log('-----  ',this.id, this.email);
        return jwt.sign(
            {id:this._id,email:this.email, subscription:this.subscription,role:this.role},
            process.env.SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY,
            }
        )
    },
    comparePassword: async function(normalPassword)
    {
        const result  = await bcrypt.compare(normalPassword, this.password);
        console.log('--- ',result);
        return result;
    },
    generatePasswordResetToken: async function(){
        const resetToken  = crypto.randomBytes(20).toString('hex');
        this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        

        this.forgotPasswordExpiry = Date.now()+15*60*1000; //15 min from current

        return resetToken;
    }
}

const User = model("User",userSchema);
export default User;
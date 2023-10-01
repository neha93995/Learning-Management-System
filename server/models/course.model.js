import {model , Schema} from 'mongoose';


const courseSchema = new Schema({
    title:{
        type:String,
        required:[true, "this is required"],
        minLength:[3,'title must be atleast 8 character'],
        maxLenght:[50,"title should be less than 50 character"],
        trim:true,
    },
    description:{
        type:String,
        required:[true, "this is required"],
        minLength:[8,'title must be atleast 8 character'],
        maxLenght:[50,"title should be less than 50 character"],
       
    },
    category:{
        type:String,
        required:true,
    },
    thumbnail:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String
                },
                secure_url:{
                    type:String
                }

            }
        }

    ],
    numberOfLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Course = model('Course', courseSchema);

export default Course;
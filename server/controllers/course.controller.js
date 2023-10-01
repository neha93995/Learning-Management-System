import AppError from "../utils/error.util.js";
import Course from "../models/course.model.js"
import cloudinary from "cloudinary"
import fs from 'fs/promises';

const getAllCourses = async (req, res, next)=>
{
    try {
        const courses =  await Course.find({}).select('-lectures');
        console.log('---------------',courses)
    
        res.status(200).json({
            success:true,
            message:"all courses",
            courses
        });
        
    } catch (error) {
        return next(new AppError(error.message,400));
        
    }
}

const getLecturesByCourseId = async (req, res, next)=>{

    try {

        const {id} = req.params;
        console.log(id);

        const course = await Course.findById(id);
        

        if(!course)
        {
            return next(
                new AppError("invalid course id",400)
            )
        }

        res.status(200).json({
            success:true,
            message:"course lectures fetched successfully",
            lectures:course.lectures

        })
    } catch (error) {
        return next(new AppError(error.message,400));
    }
}

const createCourse=async (req, res, next)=>{

    try {
        
        
        const {title, description, category, createdBy} = req.body;

    if(!title || !description || !category || !createdBy)
    {
        return next(new AppError("all fields are required",400));
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy
    });

    if(!course)
    {
        return next( new AppError('course could not be created, please try again',500));
    }

    if(req.file)
    {
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        });

        if(result)
        {
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
            
        }

        fs.rm(`uploads/${req.file.filename}`);

    }
    
    await course.save();
    
    res.status(200).json({
        success:true,
        message:"course created successfully"
    })
    } catch (error) {

        return next(new AppError(error.message,500));
        
    }
    
}

const updateCourse=async (req, res, next)=>{

    try {
        const {id} = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body
            },
            {
                runValidators:true
            }

        );

        console.log(req.body);

        if(!course)
        {
            return next( new AppError("couse with given id does not exist", 500))
        }

        res.status(200).json({
            success:true,
            message:"course updated successfully",
        })
        
    } catch (error) {
        return next( new AppError(error.message, 500))
        
    }
}

const removeCourse=async (req, res, next)=>{

    try {
        const {id} = req.params;
        const course = await Course.findById(id);

        if(!course)
        {
            return next(new AppError("course with given id does not exist",500));
        }

        // await course.remove();

        await Course.findByIdAndDelete(id);



        res.status(200).json({
            success:true,
            message:'course deleted successfully'
        })
        
    } catch (error) {
        return next(new AppError(error.message,500));
    }
}

const addLectureToCourseById = async (req, res,next)=>{

    console.log("_-------------")
    try {
        
        const {title, description} = req.body;
        const {id} = req.params;
    
        const course  = await Course.findById(id);

        console.log('------------  ',course)
    
        if(!course)
        {
            return next( new AppError("course with given id does not exist",400));
        }
    
        const lectureData = {
            title,
            description,
            lecture:{}
        };
    
        if(req.file)
        {
            try {
                
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms'
                });
        
                if(result)
                {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                    
                }
        
                fs.rm(`uploads/${req.file.filename}`);
            } catch (error) {
                return next(new AppError(error.message,500));
            }
        }
    
        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;
    
        await course.save();
    
        res.status(200).json({
            success:true,
            message:"lecture added successfully",
            course
        })
    } catch (error) {

        return next(new AppError(error.message,500));
        
    }


}


const removeLecture = async (req, res, next)=>{

    try {

        
    } catch (error) {
        return next( new AppError(error.message,500));
    }
}
export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLecture
}
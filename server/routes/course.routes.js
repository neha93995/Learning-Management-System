import {Router} from 'express';
import { addLectureToCourseById, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from '../controllers/course.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const courseRoutes = Router();

courseRoutes.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse);
        
    
courseRoutes.route('/:id')
    .get(isLoggedIn ,getLecturesByCourseId)

    .put(isLoggedIn,
        authorizedRoles('ADMIN'),
        updateCourse)

    .delete(isLoggedIn,
        authorizedRoles('ADMIN'),
        removeCourse)

    .post(isLoggedIn,
        authorizedRoles('Admin'),
        upload.single('lecture'),
        addLectureToCourseById
    );
    


export default courseRoutes;
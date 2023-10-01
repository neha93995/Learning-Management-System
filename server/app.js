import cookieParser from   'cookie-parser';
import express from   'express';
import cors from   'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'


console.log("hello")

const app = express();

// The express. json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser

app.use(express.json());

app.use(express.urlencoded({extended:true})); //-----?


// CORS or Cross-Origin Resource Sharing in Node. js is a mechanism by which a front-end client can make requests for resources to an external back-end server.
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

app.use(cors({
    origin:[process.env.FRONTED_URL],
    credentials:true
}))

// cookie-parser is a middleware which parses cookies attached to the client request object.

app.use(cookieParser());


// Using Morgan, you can easily log requests made to your Node.js server, including information such as the request method, the URL of the request, the status code of the response, and the length of the response body.

app.use(morgan('dev')); 


app.use('/ping',function(req,res){
    res.send('pong pong');
})

// routes of 3 modules

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes);
app.use('/api/v1/payments',paymentRoutes);

app.all('*',(req, res)=>{
    res.status(404).send('OOPS! 404 page not found');
})

app.use(errorMiddleware) // ? why we are not using () paranthesis



export default app;
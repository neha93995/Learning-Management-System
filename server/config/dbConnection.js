import mongoose from 'mongoose';
import {config} from "dotenv";
config();

mongoose.set("strictQuery",false); // don't show error if query for extra information 

const connectToDb = async()=>{

    try {
        console.log('-----', process.env.MONGO_URI);
        const {connection} = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/LMS')
            console.log('sdfjlaskdjfsljdf')
        if(connection)
        {
            console.log(`connected to mongodb :${connection.host}`)
        }
        
    } catch (error) {

        console.log('----')
        console.log(error.message);
        process.exit(1); // teminate because if database is not connect then we don't need to do more
        
    }
}

export default connectToDb;
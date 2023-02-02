const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.DATABASE;

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(mongoURI);
        console.log('Mongoose DB connected');
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectToMongo;
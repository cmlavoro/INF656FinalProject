const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        await mongoose.connect("mongodb+srv://johndoe:jokes123@cluster0.kwaps1k.mongodb.net/?retryWrites=true&w=majority", 
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
        )
    }
    catch(err){
        console.log(err);
    }

}

module.exports = connectDB;
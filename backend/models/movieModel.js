

import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    rating :{
        type:Number,
        required:true
    },
    image : {
        type:String,
        required:true
    },
    releaseDate:{
        type:Number,
        required:true
    }
},{ timestamps : true})

const movieModel = mongoose.models.movie || mongoose.model('movie',movieSchema);

export default movieModel
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const commentSchema = new mongoose.Schema({
    article :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'News',
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    timestampes : {
        type : Date,
        default : Date.now
    } 
}); 

commentSchema.plugin(mongoosePaginate);

export default mongoose.model('Comment', commentSchema);    
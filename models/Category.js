import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : false
    },
    slug:{
        type : String,
        required : true,
    },
    timestampes : {
        type : Date,
        default : Date.now
    }

});

categorySchema.pre("validate" , function(next){
    this.slug = slugify(this.name , {lower : true , strict : true});
});

export default mongoose.model("Category", categorySchema);
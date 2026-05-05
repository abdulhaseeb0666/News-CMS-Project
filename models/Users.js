import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullname:{
        type : String,
        required : true
    },
    username:{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['admin', 'author'],
        default : 'author',
        required : true
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model('User', userSchema);
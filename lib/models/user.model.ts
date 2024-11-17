import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id : {
        type : String, 
        requried : true,
        unique : true
    },
    username : {
        type : String,
        requried : true,
        unique : true
    },
    name : {
        type : String,
        requried : true,
    },
    image : String,
    bio : String,
    threads : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread'
    }],
    onboardedStatus : {
        type : Boolean,
        default : false
    },
    communities : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Community'
    }],
    sharedThreads : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Thread'
    }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
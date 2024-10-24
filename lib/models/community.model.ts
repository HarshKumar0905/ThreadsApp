import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
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
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    threads : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread'
    }],
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
});

const User = mongoose.models.Community || mongoose.model('Community', communitySchema);
export default User;
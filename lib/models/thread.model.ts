import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text : {
        type : String, 
        requried : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        requried : true
    },
    community : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Community',
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    parentId : {
        type : String
    },
    likes : [{
        type : String,
        ref : 'User',
        default : null,
    }],
    children : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Thread'
    }],
    mediaFiles : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Media'
    }]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);
export default Thread;
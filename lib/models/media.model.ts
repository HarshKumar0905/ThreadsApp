import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    type : {
        type : String
    },
    url : {
        type : String
    }
});

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
export default Media;
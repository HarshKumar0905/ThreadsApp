"use server";

import Media from "../models/media.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";

interface Props {
    type : string;
    url : string | undefined;
    id : string;
}

export async function postMedias({ type, url, id} : Props) {
    try {
      connectToDB();
  
      const media = await Media.create({
        type : type,
        url : url
      });

      await Thread.findByIdAndUpdate(id, { $push : {mediaFiles : media._id }}, {new : true} );
    } catch (error: any) {
      throw new Error(`Failed to create media : ${error.message}`);
    }
}
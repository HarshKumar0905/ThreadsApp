"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import Media from "../models/media.model";
import { ObjectId } from "mongoose";
import {v2 as cloudinary} from "cloudinary";

const connectCloudinary = async () => {
  try {
      await cloudinary.config({
          cloud_name : process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
          api_key : process.env.CLOUDINARY_API_KEY,
          api_secret : process.env.CLOUDINARY_SECRET_KEY
      });
  } catch (error) {
      console.log(error);
  }
  
}

export async function fetchFrequency() {
  connectToDB();

  try {
    const count = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
    return count;
  } catch (error: any) {
    throw new Error(`Failed to find frequency of thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 10) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    })
    .populate({
      path : "mediaFiles",
      select : "type url",
      model : Media
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const threads = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + threads.length;

  return { threads, isNext };
}

export type MediaFileType = {
  type: string;
  url: string;
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
  mediaFiles : Array<MediaFileType> | null
}

export async function createThread({
  text,
  author,
  communityId,
  path,
  mediaFiles
}: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    // Update Media model
    mediaFiles?.map(async (media) => {
      const createdFile = await Media.create({
        type : media.type,
        url : media.url
      });

      await Thread.findByIdAndUpdate(createdThread._id, { $push : { mediaFiles : createdFile._id}}, {new : true});
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }  
}

interface ParamsEdit {
  id: string | null;
  text: string;
}

export async function editThread({ id, text }: ParamsEdit) {
  if (!id) {
    throw new Error("Invalid thread ID");
  }

  try {
    await connectToDB(); // Ensure this handles reconnections properly if called multiple times

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { text: text },
      { new: true } // Option to return the updated document
    );

    console.log("New ---> ", updatedThread);

    if (!updatedThread) {
      throw new Error("Thread not found");
    }
  } catch (error: any) {
    throw new Error(`Failed to edit thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .populate({
        path : "mediaFiles",
        select : "type url",
        model : Media
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    const user = await User.findById(userId);
    user.threads.push(savedCommentThread._id);
    await user.save();

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function addLikeToThread(id: String, userId: String) {
  try {
    await connectToDB();
    const thread = await Thread.findByIdAndUpdate(
      id,
      { $push: { likes: userId } },
      { new: true }
    );
    return thread.likes.length;
  } catch (error: any) {
    throw new Error(`Failed to increment likes ${error.message}`);
  }
}

export async function removeLikeFromThread(id: String, userId: String) {
  try {
    await connectToDB();
    const thread = await Thread.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
    return thread.likes.length;
  } catch (error: any) {
    throw new Error(`Failed to decrement likes ${error.message}`);
  }
}

export async function removeThread(id : String, parentId : String | null) {
  try {
    await connectToDB();
    await connectCloudinary();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id);

    // Delete any media associated with the thread
    mainThread.mediaFiles.map(async (media : ObjectId)=> {
      // Delete media from db
      console.log("Deleting Thread");
      console.log("Media ID : ", media);
      const mediaItem = await Media.findByIdAndDelete(media, {new : true});

      // Delete media from cloudinary storage
      console.log("Media Deleting --> ", mediaItem.url.split("/").at(-2)+"/"+
      mediaItem.url.split("/").at(-1).split(".").at(0));

      await cloudinary.uploader.destroy(mediaItem.url.split("/").at(-2)+"/"+
      mediaItem.url.split("/").at(-1).split(".").at(0), {resource_type : mediaItem.type});
    });

    const deleteThreadRecursively = async (id : String) => {
      const thread = await Thread.findById(id);
      if (!thread) return;

      // Delete all child threads
      if (thread.children.length > 0) {
          await Promise.all(thread.children.map((childThread : any) => {
            deleteThreadRecursively(childThread._id)
      }));
      }

      // Update community model
      if(thread.community)
        await Community.findByIdAndUpdate(thread.community, { $pull: { threads : id } }, { new: true });

      // Update the parent thread
      await Thread.findByIdAndUpdate(parentId, { $pull: { children : id } }, { new: true })

      // Delete the current thread
      await User.findByIdAndUpdate(thread.author, { $pull: { threads : id } }, { new: true });
      await Thread.findByIdAndDelete(id);

    };

  if(parentId)
  await Thread.findByIdAndUpdate(parentId,  { $pull: { children: id } }, { new: true });

  await deleteThreadRecursively(id);
  } catch (error : any) {
    throw new Error(`Failed to delete the thread ${error.message}`);
  }
}

export async function topThreeThreads() {
  try {
    await connectToDB();

    const users = await User.find({});
    if (users) {
      // Calculate total likes for each user's threads
      const likesArray = await Promise.all(
        users.map(async (user) => {
          const likesForUser = await user?.threads?.reduce(async (accumulatorPromise: any, thread: any) => {
            const accumulator = await accumulatorPromise;  // Resolve accumulator first
            const threadForUser = await Thread.findById(thread);
            return accumulator + (threadForUser?.likes?.length || 0);
          }, Promise.resolve(0));  // Initialize accumulator as a resolved promise with value 0

          return {
            id: user._id,
            likes: likesForUser
          };
        })
      );

      // Sort by likes in descending order and select top three
      const sortedLikesArray = likesArray.sort((a, b) => b.likes - a.likes);
      const topThreeUsersData = sortedLikesArray.slice(0, 3);

      console.log("Top Three Threads:", topThreeUsersData);

      // Fetch full user details for the top three users based on their ID
      const topThreeUsers = await Promise.all(
        topThreeUsersData.map(async (userData: any) => {
          return await User.findById(userData.id);
        })
      );

      return {topThreeUsers, topThreeUsersData};
    }

  } catch (error: any) {
    throw new Error(`Failed to fetch top three threads: ${error.message}`);
  }
}
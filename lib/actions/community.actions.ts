"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Media from "../models/media.model";

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string // Change the parameter name to reflect it's an id
) {
  try {
    await connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    // Update User model
    if (!user.communities.includes(createdCommunity._id.toString()))
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    await connectToDB();

    const communityDetails = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);
    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    await connectToDB();
    const communityPosts = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id", // Select the "name" and "_id" fields from the "User" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "image _id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path : "community",
          model : Community
        },
        {
          path : "mediaFiles",
          model : Media,
          select : "type url"
        }
      ],
    });
    console.log("-> ", communityPosts);
    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    await connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    if (!user.communities.includes(community._id.toString()))
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    await connectToDB();

    const community = await Community.findOne({id : communityId});
    const communityID = community._id;
    console.log("Community ID : ", communityID);

    // Delete all threads associated with the community
    await Thread.deleteMany({ community : communityID });
    
    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityID });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map(async (user) => {
      user.communities.pull(communityID);
      return user.save();
    });

    // Await all promises to complete
    await Promise.all(updateUserPromises)
    .then(() => console.log('Successfully removed the community from all users.'))
    .catch((error) => console.log(error));;
     
    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }
    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

export async function topThreeCommunities() {
  try {
    await connectToDB();

    const communities = await Community.find({});
    if (communities) {
      // Calculate total likes for each user's threads
      const likesArray = await Promise.all(
        communities.map(async (community) => {
          const likesForCommunity = await community?.threads?.reduce(async (accumulatorPromise: any, thread: any) => {
            const accumulator = await accumulatorPromise;  // Resolve accumulator first
            const threadForCommunity = await Thread.findById(thread);
            return accumulator + (threadForCommunity?.likes?.length || 0);
          }, Promise.resolve(0));  // Initialize accumulator as a resolved promise with value 0

          return {
            id: community._id,
            likes: likesForCommunity
          };
        })
      );

      // Sort by likes in descending order and select top three
      const sortedLikesArray = likesArray.sort((a, b) => b.likes - a.likes);
      const topThreeCommunitiesData = sortedLikesArray.slice(0, 3);

      console.log("Top Three Threads:", topThreeCommunitiesData);

      // Fetch full user details for the top three users based on their ID
      const topThreeCommunities = await Promise.all(
        topThreeCommunitiesData.map(async (communityData: any) => {
          return await Community.findById(communityData.id);
        })
      );

      return {topThreeCommunities, topThreeCommunitiesData};
    }

  } catch (error: any) {
    throw new Error(`Failed to fetch top three threads: ${error.message}`);
  }
}
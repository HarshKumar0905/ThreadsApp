"use client";
import {
  addLikeToThread,
  removeLikeFromThread,
} from "@/lib/actions/thread.actions";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";

interface Props {
  id : string;
  likes : string[];
  currentUserId : string;
}

const Like = ({id, likes, currentUserId} : Props) => {
  const [liked, setIsLiked] = useState<boolean>(likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState<number>(likes.length);

  const addLike = async (id: string, userId : string) => {
      const count = await addLikeToThread(id, userId);
      setIsLiked(true);
      setLikeCount(count);
  }
  const removeLike = async (id: string, userId : string) => {
      const count = await removeLikeFromThread(id, userId);
      setIsLiked(false);
      setLikeCount(count);
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={liked ? () => removeLike(id, currentUserId) : () => addLike(id, currentUserId)}>
        {liked ? (
          <FaHeart className="cursor-pointer object-contain text-[#ff307c] w-5 h-5"/>
          ) : (
          <FaRegHeart className="cursor-pointer object-contain text-[#5c5c7b] w-5 h-5"/>
        )}
      </button>
      {likeCount>0 && <span className="text-[#5c5c7b]">{likeCount}</span>} 
    </div>
  );
};

export default Like;
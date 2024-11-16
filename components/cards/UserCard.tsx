"use client" 

import Image from "next/image";
import { Button } from "../ui/button";
import {useRouter} from "next/navigation";
import { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { push, pull } from "@/lib/redux/sharingSlice";

interface Props {
    id : string;
    name : string;
    username : string;
    imgUrl : string;
    personType : string;
}

const UserCard = ({id, name, username, imgUrl, personType} : Props) => {

  const router = useRouter();
  const [sharing, setSharing] = useState(false);
  const items = useSelector((state : any) => state.sharing.items); // Access the items array
  const dispatch = useDispatch();

  // Log the updated items whenever they change
  useEffect(() => {
    console.log("Updated Redux State ---> ", items);
  }, [items]);

  const handleShare = async () => {
    if(!sharing){
      dispatch(push(id));
    } else {
      dispatch(pull(id));
    }
    setSharing((prevState) => !prevState);
  }

  return (
    <article className={`user-card p-2 ${sharing ? "bg-slate-800 rounded-lg" : "bg-transparent"}`}>
      <div className="user-card_avatar">
        <Image src={imgUrl} alt="logo" width={48} height={48}
        className="rounded-full object-fit w-12 h-12" loading="lazy"/>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">
            {username}
          </p>
        </div>
      </div>

      <Button className="user-card_btn" onClick={personType === "ShareUser" ? () => handleShare() :
      () => router.push(`/profile/${id}`)}>
      {
        personType === "ShareUser" ? sharing ? "Sharing" : "Share" : "View"
      }
      </Button>
    </article>
  )
}

export default UserCard;
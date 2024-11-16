"use client" 

import Image from "next/image";
import { Button } from "../ui/button";
import {useRouter} from "next/navigation";
import { useState } from "react";

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

      <Button className="user-card_btn" onClick={personType === "ShareUser" ? () => setSharing((prevState) => !prevState) :
      () => router.push(`/profile/${id}`)}>
      {
        personType === "ShareUser" ? sharing ? "Sharing" : "Share" : "View"
      }
      </Button>
    </article>
  )
}

export default UserCard;
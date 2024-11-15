"use client";

import { topThreeThreads } from "@/lib/actions/thread.actions";
import { topThreeCommunities } from "@/lib/actions/community.actions";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import First from "@/public/assets/1st.png";
import Second from "@/public/assets/2nd.png";
import Third from "@/public/assets/3rd.png";

const RightSidebar = () => {
  const [response, setResponse] = useState<any>(null);
  const [responseCommunity, setResponseCommunity] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPayload = async () => {
      const response = await topThreeThreads();
      const responseCommunity = await topThreeCommunities();
      setResponse(response);
      setResponseCommunity(responseCommunity);
    };
    loadPayload();
  }, []);

  return (
    <section className="custom-scrollbar rightsidebar w-[24%]">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-1">
          Suggested Communities
        </h3>
        <h3 className="text-heading2-medium text-gray-600 italic font-extrabold">
          Top Three
        </h3>
        <div className="overflow-hidden h-32 relative my-auto">

        {/* Top blur overlay */}
        <div style={{background: 'linear-gradient(180deg, #121417, #fff0)'}}
        className="absolute w-full h-[40px] top-0 z-40"></div>

        <div className="w-full animate-scrollY">
        {[1, 1].map((_, repeatIndex: any) => (
        <div key={repeatIndex}>
        <div className="my-auto">
          {responseCommunity?.topThreeCommunities?.map(
            (community: any, index: number) => {
              return (
                <article className="mt-3 user-card cursor-pointer" key={index} 
                onClick={() => router.push(`/communities/${community.id}`)}>
                  <div className="user-card_avatar">
                    <Image
                      src={community.image}
                      alt="logo"
                      width={48}
                      height={48}
                      className="rounded-lg object-fit w-12 h-12"
                      loading="lazy"
                    />

                    <div className="flex-1 text-ellipsis">
                      <div className="flex items-center justify-between">
                      <h4 className="text-base-semibold text-light-1">
                        {community.name}
                      </h4>
                      <img src={index===0 ? First.src : index===1 ? Second.src : Third.src} 
                      alt="First Image" width={30} height={30} />
                      </div>
                      <p className="text-small-medium text-gray-1 text-wrap">
                        @{community.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 border-l-2 border-gray-600 pl-2">
                    <FaHeart className="cursor-pointer object-contain text-[#ff307c] w-5 h-5" />
                    <p className="text-light-1">
                      {responseCommunity?.topThreeCommunitiesData[index]?.likes}
                    </p>
                  </div>
                </article>
              );
            }
          )}
        </div>
        </div>))}
        </div>

        {/* Bottom blur overlay */}
        <div style={{background: 'linear-gradient(0deg, #121417, #fff0)'}}
        className="absolute w-full h-[40px] bottom-0 z-40"></div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-1">
          Suggested Users
        </h3>
        <h3 className="text-heading2-medium text-gray-600 italic font-extrabold">
          Top Three
        </h3>
        <div className="overflow-hidden h-48 relative my-auto">

          {/* Top blur overlay */}
          <div style={{background: 'linear-gradient(180deg, #121417, #fff0)'}}
        className="absolute w-full h-[40px] top-0 z-40"></div>

        <div className="w-full animate-scrollY">
        {[1, 1].map((_, repeatIndex: any) => (
        <div key={repeatIndex}>
        <div className="my-auto">
          {response?.topThreeUsers?.map(
            (user: any, index: number) => {
              return (
                <article className="mt-3 user-card cursor-pointer" key={index} 
                onClick={() => router.push(`/communities/${user.id}`)}>
                  <div className="user-card_avatar">
                    <Image
                      src={user.image}
                      alt="logo"
                      width={48}
                      height={48}
                      className="rounded-lg object-fit w-12 h-12"
                      loading="lazy"
                    />

                    <div className="flex-1 text-ellipsis">
                      <div className="flex items-center justify-between w-full">
                      <h4 className="text-base-semibold text-light-1">
                        {user.name}
                      </h4>
                      <img src={index===0 ? First.src : index===1 ? Second.src : Third.src} 
                      alt="First Image" width={30} height={30} />
                      </div>
                      <p className="text-small-medium text-gray-1">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 border-l-2 border-gray-600 pl-2">
                    <FaHeart className="cursor-pointer object-contain text-[#ff307c] w-5 h-5" />
                    <p className="text-light-1">
                      {response?.topThreeUsersData[index]?.likes}
                    </p>
                  </div>
                </article>
              );
            }
          )}
        </div>
        </div>))}
        </div>
 
          {/* Bottom blur overlay */}
          <div style={{background: 'linear-gradient(0deg, #121417, #fff0)'}}
          className="absolute w-full h-[40px] bottom-0 z-40"></div>

        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
"use server"

import { topThreeThreads } from '@/lib/actions/thread.actions';
import { topThreeCommunities } from '@/lib/actions/community.actions';
import Image from 'next/image';
import { FaHeart } from "react-icons/fa6";

const RightSidebar = async () => {
  const response = await topThreeThreads();
  const responseCommunity = await topThreeCommunities();
  console.log("Users ---> ", responseCommunity);

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1 mb-1'>
          Suggested Communities
        </h3>
        <h3 className='text-heading2-medium text-gray-600 italic font-extrabold'>
          Top Three
        </h3>
        <div className='my-auto'>
        {
          responseCommunity?.topThreeCommunities.map((community, index) => {
            return <article className="mt-3 user-card" key={index}>
            <div className="user-card_avatar">
              <Image src={community.image} alt="logo" width={48} height={48}
              className="rounded-lg object-fit w-12 h-12" loading="lazy"/>
      
              <div className="flex-1 text-ellipsis">
                <h4 className="text-base-semibold text-light-1">{community.name}</h4>
                <p className="text-small-medium text-gray-1">
                  @{community.username}
                </p>
              </div>
            </div>
      
            <div className='flex items-center gap-1'>
              <FaHeart className="cursor-pointer object-contain text-[#ff307c] w-5 h-5"/>
              <p className='text-light-1'>{responseCommunity?.topThreeCommunitiesData[index]?.likes}</p>
            </div>
            </article>
          })
        }
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1 mb-1'>
          Suggested Users
        </h3>
        <h3 className='text-heading2-medium text-gray-600 italic font-extrabold'>
          Top Three
        </h3>
        <div className='my-auto'>
        {
          response?.topThreeUsers.map((user, index) => {
            return <article className="mt-3 user-card" key={index}>
            <div className="user-card_avatar">
              <Image src={user.image} alt="logo" width={48} height={48}
              className="rounded-lg object-fit w-12 h-12" loading="lazy"/>
      
              <div className="flex-1 text-ellipsis">
                <h4 className="text-base-semibold text-light-1">{user.name}</h4>
                <p className="text-small-medium text-gray-1">
                  @{user.username}
                </p>
              </div>
            </div>
      
            <div className='flex items-center gap-1'>
              <FaHeart className="cursor-pointer object-contain text-[#ff307c] w-5 h-5"/>
              <p className='text-light-1'>{response?.topThreeUsersData[index]?.likes}</p>
            </div>
            </article>
          })
        }
        </div>
      </div>
    </section>
  )
}

export default RightSidebar;
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { communityTabs } from "@/constants";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

const Page = async ({params} : {params : {id : string}}) => {
  const user = await currentUser();
  if (!user) return null;
  
  const communityDetails = await fetchCommunityDetails(params.id);

  return (
  <section>
    <ProfileHeader 
      accountId={communityDetails.id}
      authUserId={communityDetails.id}
      name={communityDetails.name}
      username={communityDetails.username}
      imgUrl={communityDetails.image}
      bio={communityDetails.bio}
      type="Community"
      />

    <div>
      <Tabs defaultValue="threads" className="w-full">
        <TabsList className="tab">
        {
          communityTabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.value} className="tab">
              <Image src={tab.icon} alt={tab.label} width={24}
                height={24} className="object-contain" />

              <p className="max-sm:hidden">{tab.label}</p>

              {tab.label === 'Threads' && (
                <p className="ml-1 rounded-sm bg-light-4 px-1 py-1
                !text-tiny-medium text-light-2">{communityDetails?.threads?.length}
                </p>
              )}
            </TabsTrigger>
          ))
        }
        </TabsList>
        
        <TabsContent value="threads"
        className="w-full text-light-1">
          <ThreadsTab
          currentUserId={user.id}
          accountId={communityDetails._id}
          accountType="Community" />
        </TabsContent>
        <TabsContent value="members"
        className="w-full text-light-1">
          <section className="mt-9 flex flex-col gap-10">
          {
            communityDetails?.members.map((member : any) => (
              <UserCard key={member.id} id={member.id} name={member.name}
              username={member.username} imgUrl={member.image} 
              personType="User"/>
            ))
          }
          </section>
        </TabsContent>
        <TabsContent value="requests"
        className="w-full text-light-1">
          <p className="h-[60vh] grid place-items-center text-gray-600 italic font-bold text-large">
                This section is under development
          </p>
        </TabsContent>

      </Tabs>
    </div>
  </section>);
};

export default Page;
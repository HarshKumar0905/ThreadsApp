import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import PageActivity from "../../activity/page";
import ThreadCard from "@/components/cards/ThreadCard";

const Page = async ({params} : {params : {id : string}}) => {
  const user = await currentUser();
  let loading = false;
  if (!user) return null;

  loading = true;
  const userInfo = await fetchUser(params.id);
  console.log("Info ---> ", userInfo);
  
  if (!userInfo?.onboardedStatus) redirect("/onboarding");
  loading = false;
  
  return (
    loading ? <div className="h-[75vh] grid place-items-center">
    <Spinner label="Fetching user profile..." color="primary" labelColor="primary" className="scale-125"/>
    </div> : 
  <section>
    
    <ProfileHeader 
      accountId={userInfo.id}
      authUserId={user.id}
      name={userInfo.name}
      username={userInfo.username}
      imgUrl={userInfo.image}
      bio={userInfo.bio}
      />
    
    <div>
      <Tabs defaultValue="threads" className="w-full">
        <TabsList className="tab">
        {
          profileTabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.value} className="tab">
              <Image src={tab.icon} alt={tab.label} width={24}
                height={24} className="object-contain" />

              <p className="max-sm:hidden">{tab.label}</p>

              {tab.label === 'Threads' && (
                <p className="ml-1 rounded-sm bg-light-4 px-1 py-1
                !text-tiny-medium text-light-2">{userInfo?.threads?.length}
                </p>
              )}
            </TabsTrigger>
          ))
        }
        </TabsList>
        {
          profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value}
            className="w-full text-light-1">
            {
              tab.label === "Threads" ? 
              <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User" /> : tab.label === "Replies" ?
              <PageActivity inactive={true}/> : 
              <div className="mt-8 flex flex-col gap-4">
              {
                userInfo?.sharedThreads?.map((thread : any) => {
                  return (
                  <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={user?.id || ""}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  likes={thread.likes}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                  mediaFiles={thread.mediaFiles}
                  /> )
                })
              }
              </div>
            }
            </TabsContent>
          ))
        }
      </Tabs>
    </div>
  </section>);
};

export default Page;
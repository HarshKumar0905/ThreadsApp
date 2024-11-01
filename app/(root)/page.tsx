"use server"

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import Searchbar from "@/components/shared/Searchbar";

export default async function Home({
  searchParams,
}: {searchParams: { [key: string]: string | undefined }}) {
  let result = await fetchThreads(1, 30);
  const user = await currentUser();
  console.log("Threads ---> ", result);
  const search = searchParams.q;
  if(search!==undefined){
    console.log("Search ", search);
    const newResult = result.threads.filter((thread : any) => 
      thread.text.toLowerCase().includes(search?.toLowerCase()));
    result.threads = newResult;
  }
    

  
  return (
    <>
      <div className="sm:flex sm:flex-row justify-between flex flex-col gap-2 sm:gap-0">
        <h1 className="head-text text-left">Home</h1>
        <div><Searchbar routeType="" callIn={50} /></div>
      </div>

      <section className="mt-9 flex flex-col gap-10">
        {
          result.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
          {
            result.threads.map((thread) => (
              <ThreadCard key={thread._id} id={thread._id} 
              currentUserId={user?.id || ""} parentId={thread.parentId}
              content={thread.text} author={thread.author} likes={thread.likes}
              community={thread.community} createdAt={thread.createdAt}
              comments={thread.children}/>
            ))
          }
          </>
        )}
      </section>
    </>
  )
}
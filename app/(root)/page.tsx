"use server"

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchFrequency, fetchThreads, MediaFileType } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import Searchbar from "@/components/shared/Searchbar";
import PageComponent from "@/components/ui/PageComponent";
import { Spinner } from "@nextui-org/react";

export default async function Home({
  searchParams,
}: { searchParams: { [key: string]: string | undefined } }) {
  let loading = true;
  let count = await fetchFrequency();

  const user = await currentUser();

  const currentPage = searchParams.p || "1";
  let result = await fetchThreads(Number(currentPage), 5);
  let allThreads = await fetchThreads(1, count);
  loading = false;

  const search = searchParams.q;
  if (search !== undefined) {
    const newResult = allThreads.threads.filter((thread: any) =>
      thread.text.toLowerCase().includes(search?.toLowerCase())
    );
    result.threads = newResult;
  }

  return (
    <>
      <div className="flex flex-col gap-2 ">
        <div className="flex flex-col sm:flex sm:flex-row items-start sm:items-center w-full justify-between">
          <h1 className="head-text text-left">Home</h1>
        </div>
        <div className="flex justify-center">
          <PageComponent count={count} routeType=""/>
        </div>
        <div><Searchbar routeType="" callIn={50}/></div>
      </div>

      <section className="mt-9 flex flex-col gap-10">
        {loading ? (
        <div className="h-[60vh] grid place-items-center">
          <Spinner label="Loading Threads..." color="primary" labelColor="primary" className="scale-125"/>
        </div>
        ) :  
        result.threads.length === 0 ? (
        <h2 className="h-[60vh] grid place-items-center font-extrabold text-gray-1 head-text">
          No threads to be shown
        </h2>
        ): (
          result.threads.map((thread : any) => (
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
              sharedThread={false}
            />
          ))
        )}
      </section>
      
    </>
  );
}

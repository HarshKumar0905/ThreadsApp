"use server"

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchFrequency, fetchThreads, MediaFileType } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import Searchbar from "@/components/shared/Searchbar";
import PageComponent from "@/components/ui/PageComponent";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: { searchParams: { [key: string]: string | undefined } }) {
  let count = await fetchFrequency();

  const user = await currentUser();

  const currentPage = searchParams.p || "1";
  let result = await fetchThreads(Number(currentPage), 5);
  let allThreads = await fetchThreads(1, count);

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
        {result.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
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
            />
          ))
        )}
      </section>
      
    </>
  );
}

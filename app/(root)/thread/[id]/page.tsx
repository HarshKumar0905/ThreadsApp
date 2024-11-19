import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboardedStatus) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);
  console.log("Thread ---> ", thread);

  return (
    <section className="relative">
      <div>
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
          mediaFiles={thread?.mediaFiles}
          sharedThread={false}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          content = {thread.text}
          currentUserImage={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            likes={childItem.likes}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            mediaFiles={childItem?.mediaFiles}
            isComment
            sharedThread={false}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
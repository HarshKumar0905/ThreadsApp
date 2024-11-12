import PostThread from "@/components/forms/PostThread";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({params} : {params : {id : string}}) => {

  const user = await currentUser();
  if(!user) return null;
  const userInfo = await fetchUser(user.id);
  const id = params.id;

  const threadInfo = await fetchThreadById(params.id);

  if(!userInfo?.onboardedStatus) redirect('/onboarding');

  return (
    <>
      <h1 className="head-text">Edit Thread</h1>
      {
        threadInfo && <PostThread userId = {threadInfo._id} action={"Edit"} threadMessage={threadInfo.text}/>
      }
    </>
    
  )
}

export default page;
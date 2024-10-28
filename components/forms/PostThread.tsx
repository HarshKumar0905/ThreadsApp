"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { run } from "@/lib/validations/generator";
import { useState } from "react";

interface Props {
  user: {
    id: string | undefined;
    objectId: string | undefined;
    username: string | null | undefined;
    name: string;
    bio: string;
    image: string | undefined;
  };
  btnTitle: string;
}
const PostThread = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [thread, setThread] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  const onSubmitHandler = async (e : any) => {
    e.preventDefault();
    setWordError(null);
    const wordCount = thread.trim().length;
    if (wordCount < 3) {
      setWordError("Please enter at least 3 words.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", thread);

      createThread({
        text: thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });
  
      router.push("/");
    } catch (error) {
      throw new Error(`Error in creating thread as ${error}`);
    }
  };
  const handleAI = async () => {
    setWordError(null);
    console.log("Word : ", thread.trim().length)
    const wordCount = thread.trim().length;
    if (wordCount < 3) {
      setWordError("Please enter at least 3 words.");
      return;
    }

    try {
      setLoading(true);
      const result = await run(thread + 
        "---> modify this prompt to sound catchy, treat it as a social media post, keep it's length medium and also don't include options/steps as it doen't look good");
      setThread(result);
    } catch (error: any) {
      throw new Error(`GEMINI didn't function properly as ${error}`);
    }
    setLoading(false);
  };

  return (
      <form
        onSubmit={onSubmitHandler}
        className="mt-8 flex flex-col justify-start gap-10 overflow-x-hidden"
      >
        <div className="flex flex-col w-full gap-2">
          <p className="text-base-semibold text-light-2">
            Content
          </p>
          {wordError && <p className="text-red-500 -mt-1">{wordError}</p>}
          <textarea rows={15} cols={50} placeholder="Type your thread here..."
          className="no-focus bg-dark-3 text-light-1 rounded-xl p-2
          border-2 border-gray-400"
          onChange={(e)=>{ setThread(e.target.value); setWordError(null); }} value={thread}></textarea>
        </div>

        <div className="flex gap-10 flex-row-reverse">
          <button type="submit" className="bg-primary-500 text-white font-bold px-6 rounded-xl"
          disabled={loading}>
            Submit
          </button>

          <div className="relative inline-flex group">
            <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r 
            from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100
            group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <div className="relative inline-flex items-center justify-center px-8 py-2 text-lg font-bold
            text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" onClick={() => handleAI()}>
            {loading ? "Modifying with AI..." : "Modify with AI"}
            </div>
            </div>
        </div> 
      </form>
  );
};

export default PostThread;
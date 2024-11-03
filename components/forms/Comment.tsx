"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { run } from "@/lib/validations/generator";
import { useState } from "react";
import Lottie from "lottie-react";
import aiEffect from "../../public/assets/aiEffect.json";
import { toast } from "react-toastify";

interface Props {
  threadId: string;
  content : string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment = ({ threadId, content, currentUserImage, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [thread, setThread] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  const handleAI = async () => {
    setWordError(null);
    console.log("Word : ", thread.trim().length);
    const wordCount = thread.trim().length;
    if (wordCount < 3) {
      setWordError("Please enter at least 3 words.");
      return;
    }

    try {
      setLoading(true);
      const result = await run(
        content + " " + thread +
          "---> comment on the before mentioned text, keep it's length medium and also don't include options/steps as it doen't look good"
      );
      setThread(result);
    } catch (error: any) {
      throw new Error(`GEMINI didn't function properly as ${error}`);
    }
    setLoading(false);
  };

  const onSubmitHandler = async (e: any) => {
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

      await addCommentToThread(
        threadId,
        thread,
        JSON.parse(currentUserId),
        pathname
      );

      router.push("/");
    } catch (error: any) {
      toast.error("Failed creating a thread");
      throw new Error(`Error in creating thread as ${error}`);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="mt-14 comment-form 2xl:flex 2xl:flex-row flex flex-col items-start">

        {wordError && <p className="text-red-500 -mt-1">{wordError}</p>}
        <div className="xs:flex xs:flex-row flex flex-col w-full gap-2 items-start xs:items-center">
          <label className="text-base-semibold text-light-2 mx-auto">
            <Image src={currentUserImage} alt="Image" width={48} height={48}
            className="rounded-full" />
          </label>

          <div className="border-none outline-none text-light-1 bg-transparent flex w-full">
            <textarea rows={5} placeholder="Type your thread here..."
              onChange={(e) => {
                setThread(e.target.value);
                setWordError(null);
              }} value={thread}  className="no-focus bg-dark-3 text-light-1 rounded-xl p-2
              border-2 border-gray-400 flex w-full"
            />
          </div>
        </div>
     
        <div className="flex gap-2 justify-between mx-auto">
          <div className="relative inline-flex group">
          <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r 
          from-[#44BCFF] via-[#3f303e] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100
          group-hover:-inset-1 group-hover:duration-200 animate-tilt"
          ></div>
          <div className="relative inline-flex items-center justify-center px-4 py-2 text-lg font-bold
          text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          onClick={() => handleAI()}>
          { 
            loading ? (
              <div className="flex items-center gap-1">
                Modifying with AI <Lottie animationData={aiEffect} loop={true} className="size-5" />
              </div>
            ) : ( "Modify with AI" )
          }
          </div>
          </div>

          <button type="submit" className="bg-primary-500 text-white font-bold px-4 rounded-xl">
            Reply
          </button>
        </div>
    </form>
  );
};

export default Comment;

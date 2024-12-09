"use client";

import { usePathname, useRouter } from "next/navigation";
import { createThread, getSignedURL, MediaFileType } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { run } from "@/lib/validations/generator";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import aiEffect from "../../public/assets/aiEffect.json";
import { toast } from "react-toastify";
import upload_area from "@/public/assets/upload_area.png";
import upload_added from "@/public/assets/upload_added.png";
import upload_cancel from "@/public/assets/upload_cancel.png";
import { editThread } from "@/lib/actions/thread.actions";
import {Spinner} from "@nextui-org/react";

const PostThread = ({ userId, action, threadMessage }: { userId: string, action : string, threadMessage: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [thread, setThread] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDiv, setLoadingDiv] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [wordError, setWordError] = useState<string | null>(null);

  useEffect(() => {
    if (action === "Edit") {
      setThread(threadMessage);
    }
  }, [action, threadMessage]);

  const handleFileChange = (e: any) => {
    setFiles(Array.from(e.target.files));
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
      setLoadingDiv(true);
      if(action==="Create") {
        let fileObject : Array<MediaFileType> = [];
        // Check if files are being uploaded
      if (files && files.length > 0) {
        toast.info("Uploading files...");
      }
  
      // Loop through each file for uploading and posting media
      let i = 0;
      while (i < files.length) {
        const file = files[i];
        
        // Get signed URL for file upload
        const signedURLResult = await getSignedURL(file.type, file.size);
        const url = signedURLResult?.success?.url;
        const viewUrl = url?.split("?")[0];
  
        if (signedURLResult?.faliure) {
          toast.error(signedURLResult.faliure + "AWS s3 error");
          return;
        }
  
        // Upload the file using the signed URL
        await fetch(url! , {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        fileObject.push({ type : file.type.substring(0, 5), url : viewUrl! });
        i++; // Move to the next file
        }

        await createThread({
          text: thread,
          author: userId,
          communityId: organization ? organization.id : null,
          path: pathname,
          mediaFiles : fileObject
        });
      }

      if(action==="Edit")
      {
        await editThread({
          id : userId!,
          text : thread
        });
      } 
  
      if(action==="Create")
        toast.success("Thread created successfully");
      else
        toast.success("Thread modified successfully");
      router.push("/");
    } catch (error : any) {
      toast.error("Failed creating a thread", error.toString());
      console.error("Error in creating thread:", error);
    }
    setLoadingDiv(false);
  };  

  const handleAI = async () => {
    setWordError(null);
    setLoading(true);
    const wordCount = thread.trim().length;
    if (wordCount < 3) {
      setWordError("Please enter at least 3 words.");
      return;
    }

    try {
      const result = await run(
        thread +
          "---> modify this prompt to sound catchy, treat it as a social media post, keep it's length MEDIUM, also don't include options and 'GIVE A SINGLE RESPONSE'"
      );
      setThread(result);
    } catch (error: any) {
      throw new Error(`GEMINI didn't function properly as ${error}`);
    }
    setLoading(false);
  };

  return (
      loadingDiv ? <div className="h-[75vh] grid place-items-center">
        <Spinner label="Creating Thread..." color="primary" labelColor="primary" className="scale-125"/>
      </div> : 
    <form
      onSubmit={onSubmitHandler}
      className="mt-8 flex flex-col justify-start gap-10 overflow-hidden"
    >
      <div className="flex flex-col w-full gap-2">
        <p className="text-base-semibold text-light-2">Content</p>
        {wordError && <p className="text-red-500 -mt-1">{wordError}</p>}
        <textarea
          rows={15}
          cols={50}
          placeholder="Type your thread here..."
          className="no-focus bg-dark-3 text-light-1 rounded-xl p-2
          border-2 border-gray-400"
          onChange={(e) => {
            setThread(e.target.value);
            setWordError(null);
          }}
          value={thread}
        ></textarea>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base-semibold text-light-2">
          Upload Images & Videos 
          <span className="text-gray-500 italic ml-5">
          {
            action === "Edit" ? "Edit mode does'nt support media files changes" : 'Preview Shown'
          }
          </span>
        </p>

        {/* Display thumbnails of selected images and videos */}
        <div className="flex gap-4 mt-2 flex-wrap">
          <input
            onChange={handleFileChange}
            type="file"
            id="media"
            accept="image/*,video/*" // Allows both images and videos
            multiple
            hidden 
            disabled={action==="Edit"}
          />
          <label htmlFor="media">
            <img
              className="w-24 cursor-pointer rounded-lg"
              src={files.length > 0 ? upload_added.src : action==="Edit" ? upload_cancel.src : upload_area.src}
              alt="Upload Preview"
            />
          </label>
          {files.map((file, index) => {
            const fileURL = URL.createObjectURL(file);

            if (file.type.substring(0, 5) === "image") {
              return (
                <img
                  key={index}
                  src={fileURL}
                  alt={`Image preview ${index + 1}`}
                  className="w-24 h-24 cursor-pointer rounded-lg"
                />
              );
            } else if (file.type.substring(0, 5) === "video") {
              return (
                <video
                  key={index}
                  controls
                  src={fileURL}
                  className="w-24 h-24 cursor-pointer rounded-lg"
                />
              );
            }
          })}
        </div>
      </div>

      <div className="flex gap-10 flex-row-reverse mb-6">
        <button
          type="submit"
          className="bg-primary-500 text-white font-bold px-4 rounded-xl"
          disabled={loading}
        >
          Submit
        </button>

        <div className="relative inline-flex group">
          <div
            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r 
            from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100
            group-hover:-inset-1 group-hover:duration-200 animate-tilt"
          ></div>
          <div
            className="relative inline-flex items-center justify-center px-4 py-2 text-lg font-bold
            text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
            onClick={() => handleAI()}
          >
            {loading ? (
              <div className="flex items-center gap-1">
                Modifying with AI{" "}
                <Lottie
                  animationData={aiEffect}
                  loop={true}
                  className="size-5"
                />
              </div>
            ) : (
              "Modify with AI"
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostThread;
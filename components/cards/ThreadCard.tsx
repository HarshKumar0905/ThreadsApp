import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Like from "../shared/Like";
import ModalDelete from "../shared/ModalDelete";
import { MediaFileType } from "@/lib/actions/thread.actions";
import ReactCoursel from "../ui/ReactCoursel";
import { FaEdit } from "react-icons/fa";
import CopyText from "../shared/CopyText";
import { fetchUsers } from "@/lib/actions/user.actions";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  likes: string[];
  isComment?: boolean,
  mediaFiles : Array<MediaFileType> | null;
}

const ThreadCard = async ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  likes,
  isComment,
  mediaFiles
}: Props) => {

  const result = await fetchUsers({
    userId: currentUserId,
    pageSize: 25,
  });

  return (
    <article className={`flex w-full flex-col rounded-xl 
      ${isComment ? 'px-0 xs:px-7 my-2 bg-gray-900 py-3' : 'bg-dark-2 p-7'}`}>
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author?.id}`} className="relative h-11 w-11">
              <Image
                src={author?.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
                loading="lazy"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author?.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author?.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            {
              mediaFiles && mediaFiles.length > 0 && <ReactCoursel mediaFiles={mediaFiles} />
            }

            <div className={`${(mediaFiles && mediaFiles.length > 0) ? `mt-3` : `mt-1`} flex flex-col gap-3`}>
              <div className="flex gap-3.5 items-center">
                <Like id={id} likes={likes} currentUserId={currentUserId}/>

                <div className="flex items-center gap-0.5">
                  <Link href={`/thread/${id}`}>
                  <Image src="/assets/reply.svg" alt="heart" width={24}
                    height={24} className="cursor-pointer object-contain"
                    loading="lazy"
                  />
                  </Link>
                  {comments.length>0 && <span className="text-[#5c5c7b]">{comments.length}</span>}
                </div>
                
                {
                  author?.id === currentUserId && <Link href={`/edit-thread/${id}`}>
                  <FaEdit width={24}
                    height={24} className="text-[#5c5c7b] cursor-pointer object-contain grid place-items-center"
                  />
                  </Link>
                }

                <CopyText text={content}/>
                
                {
                  <ModalDelete header={"Share this thread to any user"} 
                  content={content} id={id} parentId={parentId} result={result}/>
                }

                {author?.id === currentUserId && <ModalDelete header={"You are about to delete this thread"} 
                content={content} id={id} parentId={parentId} result={result}/>}
              </div>

            </div>
          </div>
        </div>

      </div>
      {!isComment && !community && (
          <div className="mt-3 flex items-center">
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)}
            </p>
          </div>
        )}
        {!isComment && community && (
          <Link href={`/communities/${community.id}`}
          className="mt-3 flex items-center">
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)} - {community.name} Community
            </p>

            <Image src={community.image} alt={community.name} loading="lazy"
              width={14} height={14} className="ml-1 rounded-full object-cover"/>
          </Link>
        )}
    </article>
  );
};

export default ThreadCard;
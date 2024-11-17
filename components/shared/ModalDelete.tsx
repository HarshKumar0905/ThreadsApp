"use client";

import { removeThread } from "@/lib/actions/thread.actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useState } from "react";
import { ImBin } from "react-icons/im";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { RiShareFill } from "react-icons/ri";
import UserCard from "@/components/cards/UserCard";
import { useSelector, useDispatch } from 'react-redux';
import { empty } from "@/lib/redux/sharingSlice";
import { shareThreadToUser } from "@/lib/actions/user.actions";

interface Props {
  header: string;
  content: string;
  id: string;
  parentId: string | null;
  result : any;
}

export default function ModalDelete({
  header,
  content,
  id,
  parentId,
  result
}: Props) {
  const [onOpen, setOnOpen] = useState(false);
  const dispatch = useDispatch();
  const items = useSelector((state : any) => state.sharing.items); // Access the items array

  const handleDelete = async () => {
    try {
      await removeThread(id, parentId);
      toast.success("Thread deleted successfully");
      setOnOpen(false);
    } catch (error) {
      toast.error("Failed to delete thread");
    }
  };

  const handleShare = async () => {
    try {
      console.log("Share list ---> ", items);
  
      // Validate that there are users selected
      if (!items || items.length === 0) {
        toast.error("No user selected");
        return;
      }
  
      // Loop through selected users and share the thread
      for (let i = 0; i < items.length; i++) {
        const user: string = items[i];
        await shareThreadToUser({ id, user });
        console.log("User Added:", user);
      }
  
      // Success message and cleanup
      toast.success("Thread shared successfully");
      dispatch(empty()); // Clear the list of selected users
      setOnOpen(false); // Close modal or UI element
    } catch (error: any) {
      console.error("Error sharing thread:", error);
      toast.error("Failed to share thread");
    }
  };
  

  return (
    <>
      {header.substring(0, 5) === "Share" ? (
        <button onClick={() => setOnOpen(true)}>
          <RiShareFill
            width={26}
            height={26}
            className="text-[#5c5c7b] cursor-pointer object-contain grid place-items-center"
          />
        </button>
      ) : (
        <button onClick={() => setOnOpen(true)}>
          <ImBin className="cursor-pointer object-contain text-[#ff2d2d] w-4 h-4" />
        </button>
      )}

      <Modal
        backdrop="blur"
        isOpen={onOpen}
        classNames={{
          body: "py-6",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 relative">
                <div className="flex">
                  <p>{header}</p>
                  <IoClose
                    className="top-[11px] right-[11px] absolute cursor-pointer"
                    onClick={() => {setOnOpen(false); dispatch(empty()); }}
                  />
                </div>
              </ModalHeader>
              <ModalBody>
                {header.substring(0, 5) === "Share" ? (
                  <section>
                    <div>
                      {result.users.length === 0 ? (
                        <p className="no-result">No users found</p>
                      ) : (
                        <div className="max-h-[40vh] overflow-y-auto flex gap-1 flex-col">
                          {result.users.map((person : any) => (
                            <UserCard
                              key={person.id}
                              id={person.id}
                              name={person.name}
                              username={person.username}
                              imgUrl={person.image}
                              personType={"ShareUser"}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ) : (
                  <p>{content}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={() => {setOnOpen(false); dispatch(empty()); }}
                  className="bg-transparent text-[#ff1b1b] font-bold
                p-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  color="primary"
                  onClick={header.substring(0, 5) ? () => handleShare() : () => handleDelete()}
                  className="bg-[#6f4ef2] hover:bg-[#ff1b1b] text-white font-bold
                transition-all duration-200 p-2 rounded-lg"
                >
                  {header.substring(0, 5) === "Share"
                    ? "Share Thread"
                    : "Delete Thread"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { deleteSuggestion } from "@/lib/actions/user.actions";

interface Props {
  content: string;
  id: string;
  currentUserId: string;
}

export default function ModalDelete({
  content,
  id,
  currentUserId
}: Props) {
  const [onOpen, setOnOpen] = useState(false);

  const handleShare = async () => {
    try {
      await deleteSuggestion({id, currentUserId});
      toast.success("Thread suggestion deleted successfully");
      setOnOpen(false);
    } catch (error) {
      toast.error("Failed to delete the suggested thread");
    }
  };

  return (
    <>  
       <button className="text-white font-bold italic bg-purple-800 rounded-md 
        cursor-pointer hover:bg-red-800 transition-all duration-200 px-2 py-1"
        onClick={() => setOnOpen(true)}>
          Delete Suggestion
        </button>

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
                  <p>Are you sure that you want to delete this suggestion?</p>
                  <IoClose
                    className="top-[11px] right-[11px] absolute cursor-pointer"
                    onClick={() => setOnOpen(false)}
                  />
                </div>
              </ModalHeader>
              <ModalBody>
                <p>{content}</p>
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={() => setOnOpen(false)}
                  className="bg-transparent text-[#ff1b1b] font-bold
                p-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  color="primary"
                  onClick={() => handleShare()}
                  className="bg-[#6f4ef2] hover:bg-[#ff1b1b] text-white font-bold
                transition-all duration-200 p-2 rounded-lg"
                >
                  Delete Suggestion
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

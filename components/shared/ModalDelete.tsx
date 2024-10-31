"use client"

import { removeThread } from "@/lib/actions/thread.actions";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal";
import { useState } from "react";
import { ImBin } from "react-icons/im";
import { toast } from "react-toastify";

interface Props {
  content : string;
  id : string;
  parentId : string | null;
}

export default function ModalDelete({content, id, parentId} : Props) {
  const [onOpen, setOnOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await removeThread(id, parentId);
      toast.success("Thread deleted successfully")
      setOnOpen(false);
    } catch (error) {
      toast.error("Failed to delete thread")
    }
  }

  return (
    <>
      <button onClick={() => setOnOpen(true)}>
        <ImBin className="cursor-pointer object-contain text-[#ff2d2d] w-4 h-4"/>
      </button>
      <Modal backdrop="blur" isOpen={onOpen} classNames={{
        body: "py-6",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">You are about to delete this thread</ModalHeader>
              <ModalBody>
                <p> 
                  {content}
                </p>
              </ModalBody>
              <ModalFooter>
                <button onClick={() => setOnOpen(false)}
                className="bg-transparent text-[#ff1b1b] font-bold
                p-2 rounded-lg">
                  Close
                </button>
                <button color="primary" onClick={() => handleDelete()}
                className="bg-[#6f4ef2] hover:bg-[#ff1b1b] text-white font-bold
                transition-all duration-200 p-2 rounded-lg">
                  Delete Thread
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
"use client"

import React from 'react';
import { toast } from 'react-toastify';
import Image from "next/image";

const CopyText = ({text} : {text: string}) => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy text to clipboard");
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button onClick={handleCopy}>
        <Image src="/assets/share.svg" alt="heart" width={24}
          height={24} className="cursor-pointer object-contain"
        />
    </button>
  )
}

export default CopyText;

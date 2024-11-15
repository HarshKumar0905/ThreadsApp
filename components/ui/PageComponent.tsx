// PageComponent.js (Client Component)
"use client";

import { Pagination } from "@nextui-org/pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  count : number;
  routeType : string;
}

const PageComponent = ({ count, routeType} : Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages based on count and pageSize
  const totalPages = Math.ceil(count / 5 );

  const handlePageChange = (page : any) => {
    setCurrentPage(page);  // Update the current page on change
    router.push(`/${routeType}?p=` + page);
  };

  return (
    <div className="scale-75 translate-x-[10%]">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="success"
        loop
        showControls
      />
    </div>
  );
};

export default PageComponent;
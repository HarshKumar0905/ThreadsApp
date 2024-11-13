import { MediaFileType } from "@/lib/actions/thread.actions";
import { Carousel } from "flowbite-react";
import Image from "next/image";

interface Props {
  mediaFiles : Array<MediaFileType> | null;
}

const ReactCoursel = ({mediaFiles} : Props) => {

  return (
    <div className="mt-2 xl:-ml-6 h-56 xl:h-80 2xl:h-96 rounded-lg">
      <Carousel slide={false}>
        {mediaFiles?.map((media, index) => (
            <div>
              {media.type === "image" ? (
                <div className="flex justify-center items-center m-auto rounded-lg">
                <Image
                  src={media?.url}
                  alt="Image Not Found"
                  className="lg:h-56 xl:h-80 2xl:h-96 m-auto flex justify-center items-center rounded-lg
                  border-1.5 border-gray-600"
                  width={573} height={381}
                />
                </div>
              ) : ( 
                <div className="flex justify-center items-center m-auto rounded-lg">
                <video src={media?.url}
                controls={true}
                className="lg:h-56 xl:h-80 2xl:h-96 m-auto flex justify-center items-center rounded-lg
               border-1.5 border-gray-600"
                />
                </div>
              )}
            </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ReactCoursel;
import { MediaFileType } from "@/lib/actions/thread.actions";
import { Carousel } from "flowbite-react";

interface Props {
  mediaFiles : Array<MediaFileType> | null;
}

const ReactCoursel = ({mediaFiles} : Props) => {
  return (
    <div className="mt-2 h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg border-2 border-gray-600">
      <Carousel slide={false}>
        {mediaFiles?.map((media, index) => (
            <div className="rounded-lg">
              {media.type === "image" ? (
                <img
                  src={media?.url}
                  alt="Image Not Found"
                />
              ) : (
                <video src={media?.url}
                controls
                />
              )}
            </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ReactCoursel;
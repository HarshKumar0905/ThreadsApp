import { MediaFileType } from "@/lib/actions/thread.actions";
import { Carousel } from "flowbite-react";

interface Props {
  mediaFiles : Array<MediaFileType> | null;
}

const ReactCoursel = ({mediaFiles} : Props) => {

  return (
    <div className="mt-2 h-56 xl:h-80 2xl:h-96 rounded-lg border-2 border-gray-600">
      <Carousel slide={false}>
        {mediaFiles?.map((media, index) => (
            <div>
              {media.type === "image" ? (
                <img
                  src={media?.url}
                  alt="Image Not Found"
                  className="rounded-lg object-fill mt-2 h-56 xl:h-80 2xl:h-96 m-auto flex justify-center items-center"
                />
              ) : (
                <div className="flex justify-center items-center m-auto rounded-lg">
                <video src={media?.url}
                controls
                className="h-56 xl:h-80 2xl:h-96 m-auto flex justify-center items-center rounded-lg"
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
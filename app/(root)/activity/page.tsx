import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  inactive : boolean;
}

const PageActivity = async ({inactive=false} : Props) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboardedStatus) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

    return (
      <section>
        {
          !inactive && <h1 className="head-text mb-10">Activity</h1>
        }

        <div className="mt-10 flex flex-col gap-5">
        {
          activity.length > 0 ? (
            <>
            {
              activity.map((activity) => (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image src={activity.author.image} alt="Profile Picture"
                    width={20} height={20} className="rounded-full object-contain"/>

                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "} replied to your thread
                    </p>
                  </article>
                </Link>
              ))
            }
            </>
          ) : <p className="!text-base-regular text-light-3">
            No activity yet</p>
        }
        </div>
      </section>
    )
  }
  
export default PageActivity;
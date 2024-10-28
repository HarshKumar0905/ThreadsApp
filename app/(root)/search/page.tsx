import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {searchParams: { [key: string]: string | undefined }}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboardedStatus) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <Searchbar routeType='search' />
        <div className="mt-14 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <p className="no-result">No users found</p>
          ) : (
            <>
            {
              result.users.map((person) => (
                <UserCard key={person.id} id={person.id}
                name={person.name} username={person.username}
                imgUrl={person.image} personType='User' />
              ))
            }
            </>
          )}
        </div>
    </section>
  );
};

export default Page;
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  user: {
    id: string | undefined;
    objectId: string | undefined;
    username: string | null | undefined;
    name: string;
    bio: string;
    image: string | undefined;
  };
  btnTitle: string;
}
const AccountProfile = ({ user, btnTitle }: Props) => {

  const router = useRouter();
  const pathname = usePathname();
  const {startUpload} = useUploadThing("media");
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, 
    fieldChange: (value: String) => void) => {
    e.preventDefault();
    
    const fileReader = new FileReader();
    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if(!file.type.includes('image')) return;
       
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      }

      fileReader.readAsDataURL(file);
    }
  }

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;
    const hasImageChnaged = isBase64Image(blob);
    if(hasImageChnaged) {
      const imgRes = await startUpload(files); 

      if(imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    try {
      await updateUser({
        username : values.username,
        name : values.name,
        userId: user.id, 
        bio : values.bio,
        image : values.profile_photo,
        path : pathname
      });
      toast.success("Onboarded Successfully");
    } catch (error) {
      toast.error("Error occured while onboarding");
    }

    if(pathname === '/profile/edit') 
      router.back();
    else
      router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image src={field.value} width={96} height={96}
                  className="rounded-full object-contain" priority 
                  alt="profile photo"/>
                ) : (
                  <Image src="/assets/profile.svg" width={24} height={24}
                  className="rounded-full object-contain" priority 
                  alt="profile photo"/>
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input type="file" accept="image/*" 
                placeholder="Upload a photo" className="account-form_image-input"
                onChange={(e) => handleImage(e, field.onChange)} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-1">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl >
                <Input type="text" accept="image/*" 
                placeholder="Enter your name" className="account-form_input no-focus"
                {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-1">
              <FormLabel className="text-base-semibold text-light-2">
                User Name
              </FormLabel>
              <FormControl>
                <Input type="text" accept="image/*" 
                placeholder="Enter your user name" className="account-form_input no-focus"
                {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-1">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea rows={10}
                placeholder="Enter your bio" className="account-form_input no-focus"
                {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 text-white font-bold">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
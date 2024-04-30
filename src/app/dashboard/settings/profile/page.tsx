import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createPresignedUrlToDownload } from "@/lib/minio";
  import { isValidURL } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { getUserData } from "@/server/queries";
import React from "react";

export default async function page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) return null;
  let userData = await getUserData();
  if (userData?.image && !isValidURL(userData.image)) {
    const url = await createPresignedUrlToDownload({
      bucketName: "startpad",
      fileName: userData.image,
    });
    userData = { ...userData, image: url };
  }
  console.log("data", userData);
  return (
    <>
      <div>
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              You can edit your account information here.
            </CardDescription>
          </CardHeader>
          {userData && <UpdateProfileForm user={userData} />}
        </Card>
      </div>
    </>
  );
}

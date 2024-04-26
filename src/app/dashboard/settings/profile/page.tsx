import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPresignedUrlToDownload, getFileFromBucket } from "@/lib/minio";
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
        <Card x-chunk="dashboard-04-chunk-2">
          <CardHeader>
            <CardTitle>Plugins Directory</CardTitle>
            <CardDescription>
              The directory within your project, in which your plugins are
              located.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input
                placeholder="Project Name"
                defaultValue="/content/plugins"
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="include" defaultChecked />
                <label
                  htmlFor="include"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow administrators to change the directory.
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

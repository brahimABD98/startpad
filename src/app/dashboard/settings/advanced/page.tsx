import React from "react";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AlertTriangleIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteProfile } from "@/server/actions";
import DeleteProfileButton from "@/app/_components/DeleteProfileButton";
export default function page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-row items-center gap-x-3">
          <Button variant="ghost" disabled className=" text-red-500">
            <AlertTriangleIcon className="mr-2 h-5 w-5" />
            Danger
          </Button>
          <p className="text-gray-500 dark:text-gray-400">
            Keep in mind action performed in here cannot be undone proceed with
            caution.
          </p>
        </div>
        <Separator />
        <div>
          <section className="flex flex-col ">
            <h3 className="text-lg font-medium">Delete Account</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Deleting your account is permanent and cannot be undone. All your
              data will be permanently removed.
            </p>
          </section>
          <section className="py-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                 <DeleteProfileButton/>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

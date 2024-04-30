"use client";
import Avatar from "boring-avatars";

import {
  Avatar as Av,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/server/actions";
import { PencilIcon } from "lucide-react";
import React, { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
  import type { SelectUser } from "@/server/db/schema";

const initialState = {
  message: "",
};
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button aria-disabled={pending} disabled={pending} type="submit">
      Save
    </Button>
  );
}

export default function UpdateProfileForm({ user }: { user: SelectUser }) {
  const [state, formAction] = useFormState(updateProfile, initialState);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const profilePreviewRef = useRef<HTMLImageElement>(null);
  const handleButtonClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
      // set the image to the preview
      inputFileRef.current.addEventListener("change", (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (profilePreviewRef.current) {
              profilePreviewRef.current.src = e.target?.result as string;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  return (
    <form action={formAction}>
      <fieldset>
        {user && (
          <CardContent>
            <div className="flex flex-row items-start justify-between">
              <h2 className="py-1">Personal information</h2>
              <div className="relative inline-block ">
                <Av className="h-20 w-20  ">
                  <AvatarImage
                    alt="Avatar"
                    ref={profilePreviewRef}
                    src={user.image ?? ""}
                  />
                  <AvatarFallback>
                    <Avatar
                      name={user.name ?? "user"}
                      size="80"
                      variant="marble"
                      colors={[
                        "#92A1C6",
                        "#146A7C",
                        "#F0AB3D",
                        "#C271B4",
                        "#C20D90",
                      ]}
                    />
                  </AvatarFallback>
                </Av>
                <Button
                  className=" absolute left-3 top-5 w-3/4 bg-opacity-0 p-4 hover:bg-slate-900 hover:bg-opacity-70    hover:opacity-100 lg:opacity-0"
                  size="icon"
                  variant="link"
                  onClick={handleButtonClick}
                >
                  <PencilIcon className="h-4 w-4 text-primary-foreground" />
                  <p className="text-xs  text-primary-foreground">Edit</p>

                  <span className="sr-only">Edit avatar</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="file"
                name="image"
                ref={inputFileRef}
                id="image"
                hidden
              />
              <input hidden name="id" defaultValue={user.id} />
              <Label>Full name</Label>
              <Input
                name="name"
                defaultValue={user.name ?? ""}
                placeholder="First name"
                required
              />
              <Label>Email</Label>
              <Input
                name="email"
                defaultValue={user.email ?? ""}
                placeholder="Email"
                required
              />
              <Label>Phone number</Label>
              <Input
                name="phoneNumber"
                defaultValue={user.phoneNumber ?? ""}
                placeholder="Phone number"
              />
            </div>
          </CardContent>
        )}
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
          <p aria-live="polite" className="sr-only" role="status">
            {state?.message}
          </p>
        </CardFooter>
      </fieldset>
    </form>
  );
}

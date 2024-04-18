"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/server/actions";
import { useSession } from "next-auth/react";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
const initialState = {
  message: "",
};
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button aria-disabled={pending} type="submit">
      Save
    </Button>
  );
}

export default function UpdateProfileForm({ user }: { user: any }) {
  const [state, formAction] = useFormState(updateProfile, initialState);
  console.warn(user)
  return (
    <form action={formAction}>
      <fieldset>
        {user && (
          <CardContent>
            <legend>
              <h2 className="py-4">Personal information</h2>
            </legend>

            <div className="flex flex-col gap-4">
              <input name="id" defaultValue={user.id} />
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

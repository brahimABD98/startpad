"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { deleteProfile } from "@/server/actions";
export default function DeleteProfileButton() {
  return (
    <Button variant="destructive" onClick={() => deleteProfile()} type="submit">
      delete profile
    </Button>
  );
}

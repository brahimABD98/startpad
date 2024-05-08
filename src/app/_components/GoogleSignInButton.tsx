"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";   
import { FcGoogle } from "react-icons/fc";
      
import React from "react";

export default function GoogleSignInButton() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full"
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Signin with Google
      </Button>
    </>
  );
}

/* eslint-disable sonarjs/no-misused-promises */
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { signIn } from "next-auth/react";
import { ImGithub } from "react-icons/im";

function GithubSignInButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="w-full"
    >
      <ImGithub className="mr-2 h-4 w-4" />
      Signin with Github
    </Button>
  );
}

export default GithubSignInButton;

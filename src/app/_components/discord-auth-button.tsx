/* eslint-disable sonarjs/no-misused-promises */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
const DiscordAuthButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      className="w-full"
    >
      Login with Discord
    </Button>
  );
};

export default DiscordAuthButton;

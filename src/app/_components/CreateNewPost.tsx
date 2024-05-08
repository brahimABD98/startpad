"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { useParams } from "next/navigation";
import type { SelectUser } from "@/server/db/schema";
import { getStartupInfo } from "@/server/queries";
export default function CreateNewPost() {
  const path = useParams();

  return (
    <Card>
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold">Create a new post</h3>
      </CardHeader>
      <CardContent className="p-4">
        <form className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              className="w-full resize-none"
              placeholder="What's on your mind?"
              rows={3}
            />
            <div className="mt-2 flex items-center justify-end space-x-2">
              <Button size="sm" variant="outline">
                Upload
              </Button>
              <Button size="sm" type="submit">
                Post
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

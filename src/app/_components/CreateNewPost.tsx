"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import TextEditor from "./TextEditor";
export default function CreateNewPost() {
  const [content, setContent] = useState("");
  return (
    <Card>
      <form action="">
        <CardHeader>
          <h3 className="mb-4 text-lg font-semibold">Create a new post</h3>
          <Label htmlFor="markPinned" className="flex flex-row items-center">
            <Input
              type="checkbox"
              id="markPinned"
              name="isAnnouncement"
              className="mr-2 h-6 w-6"
            />
            Mark this as an Announcement
          </Label>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <TextEditor setContent={setContent} />
              <input type="hidden" name="PostContent" value={content} />
              <div className="mt-2 flex items-center justify-end space-x-2">
                <Button size="sm" type="submit">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

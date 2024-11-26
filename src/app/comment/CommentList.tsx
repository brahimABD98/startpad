import { Button } from "@/components/ui/button";

import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import React from "react";
import { getImageURL, getPostById, getPostComments } from "@/server/queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquareIcon } from "lucide-react";
import { DisplayServerImages } from "../_components/DisplayServerImages";
import CreateComment from "../_components/CreateComment";
import { getServerAuthSession } from "@/server/auth";

export default async function CommentList({
  post_id,
}: Readonly<{ post_id: string }>) {
  const comments = await getPostComments(post_id);
  const post = await getPostById(post_id);
  const session = await getServerAuthSession();
  const user_avatar_url = await getImageURL(session?.user.image);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <MessageSquareIcon className="h-5 w-5" />
          <span className="sr-only">Comment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{post?.title}</DialogTitle>
          <DialogDescription>
            Read latest comments on this post
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {comments.length === 0 && (
                <p className="text-sm text-gray-500">No comments yet</p>
              )}
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 flex items-start space-x-4 last:mb-0"
                >
                  <Avatar>
                    <DisplayServerImages
                      src={comment.user.image}
                      alt={comment.user.name ?? "user"}
                    />
                    <AvatarFallback>
                      {(comment.user.name ?? "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{comment.user.name}</p>
                    <p className="text-sm text-gray-500">{comment.content}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            {session?.user && <CreateComment user_avatar={user_avatar_url} />}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import GetAvatar from "./GetAvatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getStartupPosts } from "@/server/queries";
import { Heart, Share } from "lucide-react";
import type { SelectStartups } from "@/server/db/schema";
import { DisplayPostContent } from "./DisplayTextEditorContent";
import { likePost } from "@/server/actions";
import CommentList from "../comment/CommentList";

export async function DisplayAllPosts({
  startup,
}: Readonly<{
  startup: SelectStartups;
}>) {
  const posts = await getStartupPosts(startup);

  return (
    <>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <GetAvatar
                src={post.createdByStartup?.logo ?? post.createdByUser?.image}
                alt={post.createdByUser?.name ?? post.createdByStartup?.name}
              />
              <div>
                <h4 className="font-semibold">
                  {post.createdByUser?.name ?? post.createdByStartup?.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.updatedAt?.toLocaleDateString() ??
                    post.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <DisplayPostContent content={post.content} />
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <form action={likePost}>
                <input type="hidden" name="postId" value={post.id} />
                <Button type="submit" size="icon" variant="ghost">
                  <p className="mx-1">
                    {post.postsLikes.length ? post.postsLikes.length : ""}
                  </p>
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Like</span>
                </Button>
              </form>
              {/* <Button size="icon" variant="ghost">
                <InboxIcon className="h-5 w-5" />
                <span className="sr-only">Comment</span>
              </Button> */}
              <CommentList post_id={post.id} />
              <Button size="icon" variant="ghost">
                <Share className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

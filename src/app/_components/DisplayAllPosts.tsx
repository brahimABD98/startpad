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
import { Heart, InboxIcon, Share } from "lucide-react";
import type { SelectStartups } from "@/server/db/schema";
import { DisplayPostContent } from "./DisplayPostContent";

export async function DisplayAllPosts({
  startup,
}: {
  startup: SelectStartups;
}) {
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
              <Button size="icon" variant="ghost">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Like</span>
              </Button>
              <Button size="icon" variant="ghost">
                <InboxIcon className="h-5 w-5" />
                <span className="sr-only">Comment</span>
              </Button>
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

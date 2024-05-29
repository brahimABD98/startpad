import React from "react";

import Image from "next/image";
import Link from "next/link";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import {
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, InboxIcon, Mountain, Share } from "lucide-react";
import CreateNewPost from "@/app/_components/CreateNewPost";
import { getStartupInfo, getUserWithStartups } from "@/server/queries";
import { DisplayAllPosts } from "@/app/_components/DisplayAllPosts";
import { Announcements } from "@/app/_components/Announcements";
import { StartupGallery } from "@/app/_components/StartupGallery";

export default async function Page({ params }: { params: { id: string } }) {
  const startup_info = await getStartupInfo(params.id);
  if (!startup_info) return null;
  const user = await getUserWithStartups();
  if (!user) return null;
  const is_owner = startup_info?.founderId === user?.id;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative bg-gray-100 px-6 py-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100 md:px-8 md:py-6">
        <div className="container mx-auto">
          <div className="relative h-48 w-full">
            <Image
              alt="Cover image"
              className="h-[480px] w-full rounded-lg object-cover"
              src="/placeholder.svg"
              layout="fill"
            />
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <Link href="#">
                  <Mountain className="h-10 w-10 object-cover md:h-12 md:w-12" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
              </div>
              <div className="text-lg font-semibold md:text-xl">Acme Inc</div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-8 md:py-12">
          <Tabs className="w-full" defaultValue="all-posts">
            <TabsList className="flex border-b border-gray-200 dark:border-gray-700">
              <TabsTrigger value="all-posts">All Posts</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-8" value="all-posts">
              {is_owner && <CreateNewPost user={user} />}

              <Card className="mt-8">
                <CardHeader>
                  <h3 className="mb-4 text-lg font-semibold">All Posts</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <DisplayAllPosts startup={startup_info} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="mt-8" value="announcements">
              <Announcements startup={startup_info} />
            </TabsContent>
            <TabsContent className="mt-8" value="gallery">
              <StartupGallery startup={startup_info} />
            </TabsContent>
            <TabsContent className="mt-8" value="trending">
              <Card>
                <CardHeader>
                  <h3 className="mb-4 text-lg font-semibold">Trending Posts</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              alt="@shadcn"
                              src="/placeholder-avatar.jpg"
                            />
                            <AvatarFallback>JP</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">Jared Palmer</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @shadcn
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          May 1, 2024
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Quaerat, dolores?
                        </p>
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
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              alt="@shadcn"
                              src="/placeholder-avatar.jpg"
                            />
                            <AvatarFallback>JP</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">Jared Palmer</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @shadcn
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          April 30, 2024
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Autem, ipsa.
                        </p>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

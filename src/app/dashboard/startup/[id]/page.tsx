import React from "react";

import Image from "next/image";
import Link from "next/link";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import {
  CardHeader,
  CardContent,
  Card,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, InboxIcon, Mountain, Share } from "lucide-react";
import CreateNewPost from "@/app/_components/CreateNewPost";
import { getStartupInfo, getUserData, getUserStartups } from "@/server/queries";
import UserAvatar from "@/app/_components/UserAvatar";

export default async function Page({ params }: { params: { id: string } }) {
  const startup_info = await getStartupInfo(params.id);
  const user = await getUserData();
  const user_startups = await getUserStartups();
  console.log(user);
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
              {is_owner && (
                <CreateNewPost user={user} user_startups={user_startups} />
              )}

              <Card className="mt-8">
                <CardHeader>
                  <h3 className="mb-4 text-lg font-semibold">All Posts</h3>
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
                          May 2, 2024
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Ea aspernatur quae voluptatem porro quisquam
                          fugit velit earum nobis voluptatibus voluptate maxime
                          ratione ducimus modi, quasi qui ipsum eveniet! Dicta,
                          est.
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
                          April 28, 2024
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Cupiditate, porro quis enim assumenda reiciendis
                          aperiam? Reiciendis saepe in accusamus amet at commodi
                          voluptate tenetur voluptatibus! Aspernatur
                          consequuntur sit libero fugiat.
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
            <TabsContent className="mt-8" value="announcements">
              <Card>
                <CardHeader>
                  <h3 className="mb-4 text-lg font-semibold">
                    Pinned Announcements
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>New Feature Release</CardTitle>
                        <CardDescription>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Eius, nemo!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          The new feature is designed to make your life easier.
                          Check it out and let us know what you think!
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Maintenance</CardTitle>
                        <CardDescription>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Officia, nam.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p>
                          The maintenance will take place on Saturday, May 6th
                          from 2am to 6am UTC. We apologize for any
                          inconvenience.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="mt-8" value="gallery">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Image
                  alt="Gallery Image 1"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <Image
                  alt="Gallery Image 2"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <Image
                  alt="Gallery Image 3"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <Image
                  alt="Gallery Image 4"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <Image
                  alt="Gallery Image 5"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <Image
                  alt="Gallery Image 6"
                  className="rounded-lg object-cover"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
              </div>
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

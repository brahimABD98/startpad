import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Mountain } from "lucide-react";
import CreateNewPost from "@/app/_components/CreateNewPost";
import { getStartupInfo, getUserWithStartups } from "@/server/queries";
import { DisplayAllPosts } from "@/app/_components/DisplayAllPosts";
import { Announcements } from "@/app/_components/Announcements";
import { StartupGallery } from "@/app/startup/StartupGallery";
import { Skeleton } from "@/components/ui/skeleton";
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
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
            </TabsList>
            <TabsContent className="mt-8" value="all-posts">
              {is_owner && <CreateNewPost user={user} />}

              <Card className="mt-8">
                <CardHeader>
                  <h3 className="mb-4 text-lg font-semibold">All Posts</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Suspense
                      fallback={
                        <div className="text-red-400">loading.....</div>
                      }
                    >
                      <DisplayAllPosts startup={startup_info} />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="mt-8" value="announcements">
              <Announcements startup={startup_info} />
            </TabsContent>
            <TabsContent className="mt-8" value="gallery">
              <Suspense fallback={<GallerySkeleton />}>
                <StartupGallery startup={startup_info} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

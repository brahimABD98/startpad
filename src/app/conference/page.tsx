import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { NewConference } from "./NewConference";
import { getLatestConferences, getUserStartups } from "@/server/queries";
import { getDate, getTime } from "@/lib/utils";
export default async function Page() {
  const user_startups = await getUserStartups();
  const lastestConferences = await getLatestConferences();
  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-gray-100 py-12 dark:bg-gray-800 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Connect with your team
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Join video conferences with your colleagues and stay connected.
              </p>
              <NewConference startups={user_startups} />
            </div>
            <div className="hidden md:block">
              <Image
                src="/placeholder.svg"
                width={600}
                height={400}
                alt="Video Conference"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Upcoming Conferences
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lastestConferences.map((conference) => (
              <Card key={conference.id} className="p-4">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">
                        {getDate(conference.startDate.toString())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">
                        {getTime(conference.startDate.toString())}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{conference.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conference.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Join
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

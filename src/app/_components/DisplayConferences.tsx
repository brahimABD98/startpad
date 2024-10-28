import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getLatestConferences } from "@/server/queries";
import { Calendar, Video } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function DisplayConferences({
  startup_id,
}: Readonly<{
  startup_id: string;
}>) {
  const conferences = await getLatestConferences(startup_id);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upcoming Online Conferences</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conferences.map((conference) => (
          <Card key={conference.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{conference.name}</CardTitle>
              <CardDescription>{conference.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={conference.startDate}>
                  {new Date(conference.startDate).toLocaleString(undefined, {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>Online Video Conference</span>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button className="w-full">
                <Link href={`/conference/${conference.id}`} prefetch={false}>
                  Join Conference
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {conferences.length === 0 && (
        <p className="text-center text-muted-foreground">
          No upcoming conferences at the moment.
        </p>
      )}
    </div>
  );
}

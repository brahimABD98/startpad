import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SelectStartups } from "@/server/db/schema";
import { getStartupAnnouncements } from "@/server/queries";
import React from "react";
import { DisplayPostContent } from "./DisplayTextEditorContent";
import GetAvatar from "./GetAvatar";

export async function Announcements({ startup }: { startup: SelectStartups }) {
  const announcements = await getStartupAnnouncements(startup);
  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="mb-4 text-lg font-semibold">Pinned Announcements</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="flex flex-row gap-x-2">
                    <GetAvatar
                      src={
                        announcement.createdByUser?.image ??
                        announcement.createdByStartup?.logo
                      }
                      alt={
                        announcement.createdByStartup?.name ??
                        announcement.createdByUser?.name
                      }
                    />
                    {announcement.title}
                  </CardTitle>
                  <CardDescription>
                    <p>
                      {announcement.updatedAt?.toLocaleDateString() ??
                        announcement.createdAt.toLocaleDateString()}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <DisplayPostContent content={announcement.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

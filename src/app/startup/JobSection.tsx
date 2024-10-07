import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Trash2 } from "lucide-react";
import React from "react";
import type { FormEvent } from "react";
import CreateNewListing from "../_components/CreateNewListing";
import {
  getStartupInfo,
  getStartupJoblistings,
  getUserWithStartups,
  isFounder,
} from "@/server/queries";
import { db } from "@/server/db";
import { deleteJobListing } from "@/server/actions";
import DeleteJobEntryButton from "../_components/DeleteJobEntryButton";
interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
}

export default async function JobSection({ id }: { id: string }) {
  const jobs = await getStartupJoblistings(id);

  const is_founder = await isFounder(id);
  return (
    <>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Open Positions</h2>
            {is_founder && <CreateNewListing id={id} />}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader className="relative">
                  <CardTitle>{job.title}</CardTitle>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  {is_founder && (
                    <DeleteJobEntryButton
                      startup_id={id}
                      job_id={job.id}
                      job_title={job.title}
                    />
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-2">
                    <Clock className="mr-1 h-3 w-3" />
                    {job.type}
                  </Badge>
                  <p className="text-gray-600">{job.description}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button disabled={is_founder} className="w-full">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

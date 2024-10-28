import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import React from "react";
import CreateNewListing from "../_components/CreateNewListing";
import { getStartupJoblistings, isFounder } from "@/server/queries";
import DeleteJobEntryButton from "../_components/DeleteJobEntryButton";
import EditJobListing from "../_components/EditJobListing";
import Link from "next/link";

export default async function JobSection({ id }: { id: string }) {
  const jobs = await getStartupJoblistings(id);
  const is_founder = await isFounder(id);
  return (
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
                    <>
                      <div className="absolute right-12 top-2 flex">
                        <EditJobListing
                          key={job.id + job.updated_at?.toString()}
                          initialData={job}
                        />
                      </div>
                      <div className="absolute right-0 top-0  flex ">
                        <DeleteJobEntryButton
                          startup_id={id}
                          job_id={job.id}
                          job_title={job.title}
                        />
                      </div>
                    </>
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
                  <Button className="w-full">
                    <Link href={`/job/${job.id}`}>
                      {is_founder ? "View" : "Apply Now"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
  );
}

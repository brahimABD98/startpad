"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryState } from "nuqs";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  ArrowUpDown,
  Clock,
  Building,
} from "lucide-react";
import type { InferResultType } from "@/lib/utils";
import Link from "next/link";

const jobTypes = ["Full-time", "Part-time", "Contract"];
const locations = ["San Francisco, CA", "New York, NY", "Remote"];

type JobListingsWithStartupSchema = InferResultType<
  "job_listings",
  { startup: true }
>;

export default function JobListings({
  jobPostings,
}: Readonly<{
  jobPostings: JobListingsWithStartupSchema[];
}>) {
  const [typeFilter, setTypeFilter] = useQueryState("type", {
    defaultValue: "",
  });
  const [locationFilter, setLocationFilter] = useQueryState("location", {
    defaultValue: "",
  });
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });

  const [sortOrder, setSortOrder] = useState("desc");

  const filteredAndSortedJobs = useMemo(() => {
    let result = jobPostings;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.startup.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // filter by type
    if (typeFilter) {
      result = result.filter((job) => job.type === typeFilter);
    }
    if (locationFilter) {
      result = result.filter((job) => job.location === locationFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

    return result;
  }, [jobPostings, searchTerm, typeFilter, locationFilter, sortOrder]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Job Listings</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full space-y-6 md:w-64">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Search</h2>
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => void setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Job Type</h2>
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  onCheckedChange={(checked) =>
                    void setTypeFilter(checked ? type : null)
                  }
                />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Location</h2>
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  onCheckedChange={(checked) =>
                    void setLocationFilter(checked ? location : null)
                  }
                />
                <Label htmlFor={`location-${location}`}>{location}</Label>
              </div>
            ))}
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Sort Order</h2>
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="w-full"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            </Button>
          </div>
        </aside>
        <main className="flex-1">
          <div className="space-y-6">
            {filteredAndSortedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={job.company.logo ?? ""}
                          alt={`${job.company.name} logo`}
                        />
                        <AvatarFallback>
                          {job.company.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar> */}
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {job.startup.name}
                        </p>
                      </div>
                    </div>
                    <Badge>{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span className="text-sm">{job.payrange}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="text-sm">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      {/* <span className="text-sm">{job.company.description}</span> */}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="responsibilities">
                        <AccordionTrigger>Responsibilities</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{job.responsabilities}</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="requirements">
                        <AccordionTrigger>Requirements</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{job.requirements}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Badge variant="secondary">ID: {job.id.slice(0, 8)}</Badge>
                  <Link href={`/job/${job.id}`}>
                    <Button>Apply Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

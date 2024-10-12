import { getJobListingByid } from "@/server/queries";
import React from "react";
import { Header } from "../../_components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";

export default async function page({ params }: { params: { id: string } }) {
  const job = await getJobListingByid(params.id);
  return (
    <>
      <main>
        <section>
          <Header />
        </section>
        <section>
          <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto max-w-4xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2 text-3xl font-bold">
                      {job?.title}
                    </CardTitle>
                    <CardDescription className="text-xl">
                      {job?.startup.name}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1 text-lg">
                    {job?.created_at.toLocaleDateString().toString() ?? "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{job?.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    <span>{job?.payrange}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    <span>{job?.type}</span>
                  </div>

                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Job Description
                  </h3>
                  <p>{job?.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Responsibilities
                  </h3>
                  <p>{job?.responsabilities}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">Requirements</h3>
                  <p>{job?.requirements}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

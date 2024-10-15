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
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import CreateJobApplication from "@/app/_components/CreateJobApplication";
import { getServerAuthSession } from "@/server/auth";
export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession()
  const user = session?.user;

  const job = await getJobListingByid(params.id);
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">{job?.title}</CardTitle>
                <CardDescription className="text-xl">{job?.startup.name}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {job?.created_at.toLocaleString()}
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
              {/* <div className="flex items-center"> */}
              {/*   <Calendar className="mr-2 h-5 w-5" /> */}
              {/*   <span>Start ASAP</span> */}
              {/* </div> */}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Job Description</h3>
              <p>{job?.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job?.responsabilities}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job?.requirements}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            {user?.id && job &&
              <CreateJobApplication job_title={job.title} user_id={user.id} job_id={job.id} />
            }
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

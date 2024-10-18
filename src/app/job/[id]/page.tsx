import {
  getJobListingByid,
  isFounder,
  getjobwithCandidates,
  generateDocumentUrl,
} from "@/server/queries";
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
import { MapPin, DollarSign, Briefcase, Download } from "lucide-react";
import CreateJobApplication from "@/app/_components/CreateJobApplication";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DisplayServerImages } from "@/app/_components/DisplayServerImages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
async function DownloadDocumentButton({ filename }: { filename: string }) {
  const file_url = await generateDocumentUrl(filename);
  return (
    <>
      <Button className="w-1/4">
        <Download className="h-5 w-5" />
        <a href={file_url}>
          <span>Download</span>
        </a>
      </Button>
    </>
  );
}
async function CandidateList({
  startup_id,
  job_id,
}: {
  startup_id: string;
  job_id: string;
}) {
  const is_founder = await isFounder(startup_id);
  const job_applications = await getjobwithCandidates(startup_id, job_id);

  return (
    <>
      {is_founder && (
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
            <CardDescription>
              Potential matches for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {job_applications.map((job_application) => (
                <li
                  key={job_application.id}
                  className="flex items-center space-x-4"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start p-0"
                      >
                        <div className="flex w-full items-center space-x-4">
                          <Avatar>
                            <DisplayServerImages
                              src={job_application.user.image}
                              alt={job_application.user.name ?? "user"}
                            />
                            <AvatarFallback>
                              {(job_application.user.name ?? "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium">
                              {job_application.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {job_application.created_at.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>{job_application.user.name}</DialogTitle>
                        <DialogDescription>
                          <p>email:{job_application.user.email}</p>
                          <p>
                            sumbited:
                            {job_application.created_at.toDateString()}
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="coverLetter">Cover Letter</Label>
                          {job_application.coverLetter?.fileName ? (
                            <DownloadDocumentButton
                              filename={job_application.coverLetter.fileName}
                            />
                          ) : (
                            "No cover letter uploaded"
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="resume">Resume</Label>
                          {job_application.resume?.fileName ? (
                            <DownloadDocumentButton
                              filename={job_application.resume?.fileName}
                            />
                          ) : (
                            "No resume uploaded"
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const user = session?.user;

  const job = await getJobListingByid(params.id);
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            <Card className="mb-8">
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
                  <h3 className="mb-2 text-xl font-semibold">
                    Job Description
                  </h3>
                  <p>{job?.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Responsibilities
                  </h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {job?.responsabilities}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold">Requirements</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {job?.requirements}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {user && job && (
                  <CreateJobApplication
                    job_title={job.title}
                    user_id={user.id}
                    job_id={job.id}
                  />
                )}
              </CardFooter>
            </Card>
          </div>
          {job && (
            <aside className="lg:w-1/3">
              <CandidateList startup_id={job.startup_id} job_id={job.id} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

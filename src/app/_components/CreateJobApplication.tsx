"use client";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertJobApplicationSchema } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { addJobApplication } from "@/server/actions";
function JobApplication({
  user_id,
  job_id,
}: {
  user_id: string;
  job_id: string;
}) {
  type Inputs = z.infer<typeof insertJobApplicationSchema>;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formdata = new FormData();
    if (data.cover_letter) {
      formdata.append("cover_letter", data.cover_letter);
    }
    if (data.resume) {
      formdata.append("resume", data.resume);
    }
    formdata.append("job_id", data.job_id);
    await addJobApplication(formdata);
  };
  const form = useForm<Inputs>({
    resolver: zodResolver(insertJobApplicationSchema),
  });
  const { setValue } = form;
  useEffect(() => {
    setValue("user_id", user_id);
    setValue("job_id", job_id);
  }, [user_id, job_id, setValue]);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  Upload your resume in PDF, DOC, or DOCX format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cover_letter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  Upload your cover letter in PDF, DOC, or DOCX format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Application</Button>
        </form>
      </Form>
    </>
  );
}

export default function CreateJobApplication({
  job_id,
  job_title,
  user_id,
}: {
  job_id: string;
  job_title: string;
  user_id: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for {job_title}</DialogTitle>
          <DialogDescription>
            Fill out the form below to apply for this position.
          </DialogDescription>
        </DialogHeader>
        <JobApplication job_id={job_id} user_id={user_id} />
      </DialogContent>
    </Dialog>
  );
}

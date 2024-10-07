"use client";
import { Button } from "@/components/ui/button";
import { deleteJobListing } from "@/server/actions";
import { Trash2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
function Submit({ job_title }: { job_title: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      size="icon"
      className="absolute right-2 top-2 h-8 w-8"
      aria-label={`Delete ${job_title} job listing`}
      disabled={pending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
export default function DeleteJobEntryButton({
  job_id,
  startup_id,
  job_title,
}: {
  job_id: string;
  startup_id: string;
  job_title: string;
}) {
  const { pending } = useFormStatus();

  return (
    <form action={deleteJobListing}>
      <input hidden type=" text" name="startup_id" value={startup_id} />
      <input hidden name="job_id" type="text" value={job_id} />
      <Submit job_title={job_title} />
    </form>
  );
}

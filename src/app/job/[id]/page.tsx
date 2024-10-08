import { getJobListingByid } from "@/server/queries";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const job_listing = await getJobListingByid(params.id);
  
  return <div>page</div>;
}

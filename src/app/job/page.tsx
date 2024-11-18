import React from "react";
import { Header } from "../_components/Header";
import JobsList from "../_components/JobsList";
import { getJobPostings } from "@/server/queries";

export default async function Page() {
  const job_postings = await getJobPostings();
  return (
    <main>
      <Header />
      <section>
        <JobsList jobPostings={job_postings} />
      </section>
    </main>
  );
}

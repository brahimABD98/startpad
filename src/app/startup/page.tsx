import { db } from "@/server/db";
import React from "react";
import { Header } from "../_components/Header";
import Directory from "../_components/Directory";
export default async function page() {
  const startups = await db.query.startups.findMany();
  return (
    <>
      <main>
        <Header />
        <section>
          <Directory items={startups} />
        </section>
      </main>
    </>
  );
}

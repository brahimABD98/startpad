import "server-only";
import { db } from "./db";
import { getServerAuthSession } from "./auth";

import { z } from "zod";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
export async function getUserStartups() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) throw Error("Unauthorized");
  const startups = db.query.startups.findMany({
    where: (model, { eq }) => eq(model.founderId, userId),
  });

  return startups;
}

export async function getUserData() {
  const session = await getServerAuthSession();

  const user = session?.user;
  if (!user) throw Error("Unauthorized");

  const userdata = db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, user?.id),
  });
  return userdata;
}

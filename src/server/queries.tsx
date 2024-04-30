import "server-only";
import { db } from "./db";
import { getServerAuthSession } from "./auth";
import { eq, and } from "drizzle-orm";
import { startups } from "./db/schema";
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

export async function getStartupInfo(id: string) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) throw Error("Unauthorized");
  const startup = db.query.startups.findFirst({
    where: and(eq(startups.id, Number(id)), eq(startups.founderId, userId)),
  });
  return startup;
}

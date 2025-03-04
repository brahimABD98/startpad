import Link from "next/link";
import { Home, ListFilter, Settings, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getServerAuthSession } from "@/server/auth";
import { getImageURL, getUserStartups } from "@/server/queries";
import DashboardNav from "../_components/DashboardNav";
import AddStartup from "../startup/AddStartup";
import { DisplayServerImages } from "../_components/DisplayServerImages";
import { redirect } from "next/navigation";
import DashboardSideBar from "../_components/DashboardSideBar";
export default async function Page() {
  const session = await getServerAuthSession();
  console.log(session);
  if (!session?.user) return redirect("/signin");
  const startups = await getUserStartups();
  const image_url = await getImageURL(session.user.image);

  return (
    <div className="flex min-h-screen w-full flex-col  bg-muted/40">
      <DashboardSideBar />
      <div className="flex h-screen flex-col   sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardNav logo={image_url} />
        <main className="grid flex-1  items-start gap-4  p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2 ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AddStartup />
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Startups</CardTitle>
                  <CardDescription>
                    Manage your Startups over here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {startups?.length === 0 && (
                    <div className="m-4 flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                          You have no startups
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          You can start selling as soon as you add a startup.
                        </p>
                        <AddStartup />
                      </div>
                    </div>
                  )}
                  {startups?.map((startup) => (
                    <Card key={startup.id} className="lg:w-1/4">
                      <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <DisplayServerImages
                          height={48}
                          width={48}
                          src={startup.logo}
                          alt={`${startup.name}`}
                        />
                        <div className="grid gap-1">
                          <CardTitle>{startup.name ?? "example"}</CardTitle>
                          <CardDescription>
                            {startup.description ?? "description exmaple "}
                          </CardDescription>
                        </div>
                        <Link
                          className="ml-auto"
                          href={`/startup/${startup?.id}`}
                        >
                          <Button size="sm">Select</Button>
                        </Link>
                      </CardHeader>
                    </Card>
                  ))}
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Home, Users, Settings } from "lucide-react";
import React from "react";
import { DisplayServerImages } from "./DisplayServerImages";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { isAdmin } from "@/server/queries";

export default async function DashboardSideBar() {
  const session = await getServerAuthSession();
  const is_admin = await isAdmin();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <DisplayServerImages
            width={48}
            height={48}
            alt={`${session?.user.name}`}
            src={session?.user.image}
          />
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="roundedw-lg flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          {is_admin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/users"
                  className="roundedw-lg flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Users</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Users</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

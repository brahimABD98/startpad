"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  HelpCircleIcon,
  LogOut,
  Menu,
  Package2,
  Search,
  Settings,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { dashboardSearch } from "@/server/actions";
import type { SelectStartups } from "@/server/db/schema";
import { CommandLoading } from "cmdk";

const DashboardNav = ({ logo }: { logo?: string }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState<SelectStartups[]>([]);
  const handleSearch = async (text: string) => {
    setLoading(true);
    const results = await dashboardSearch(text);
    if (results) setSearchResults([...results]);
    setLoading(false);
  };
  console.log(searchResults);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="/startup"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Startup
        </Link>

        <Link
          href="#"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Settings
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center  gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Startup
            </Link>
            <Link
              href="#"
              className="text-foreground transition-colors hover:text-foreground"
            >
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full  justify-end gap-4  md:ml-auto md:gap-2 lg:gap-4">
        <div>
          <Button
            variant="outline"
            className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4 xl:mr-2" />
            <span className="hidden xl:inline-flex">Search...</span>
            <span className="sr-only">Search</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              onValueChange={handleSearch}
              name="text"
              placeholder="Type a command or search..."
            />
            <CommandList>
              {loading && <CommandLoading>loading ...</CommandLoading>}
              <CommandSeparator />
              <div>
                {searchResults.map((result) => (
                  <CommandItem key={result.founderId}>
                    <span>{result.logo}</span>
                  </CommandItem>
                ))}
              </div>
            </CommandList>
          </CommandDialog>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Image
                src={logo ?? "/placeholder-user.jpg"}
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button variant="ghost">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings">
                <Button variant="ghost">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant="ghost">
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                Support
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={() => signOut()} variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNav;

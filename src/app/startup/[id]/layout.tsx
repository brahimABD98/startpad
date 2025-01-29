import Link from "next/link";
import { Home, Package, Users } from "lucide-react";

import { getImageURL, getStartupInfo } from "@/server/queries";
import DashboardNav from "@/app/_components/DashboardNav";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const startup_info = await getStartupInfo(params.id);
  if (!startup_info) return null;
  const logo = await getImageURL(startup_info.logo);
  return (
    <div className="w-full">
      <div className="flex h-14 items-center border-b lg:h-[60px]">
        <DashboardNav logo={logo} />
      </div>
      <div className="flex flex-row">
        <div className="hidden border-r bg-muted/40 md:block ">
          <div className="flex h-full w-72  flex-col gap-2 ">
            <nav className="grid items-start  px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary "
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary "
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary "
              >
                <Users className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-4 lg:p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

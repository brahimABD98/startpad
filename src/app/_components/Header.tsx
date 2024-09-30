import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { Rocket } from "lucide-react";
import Link from "next/link";
export async function Header() {
  const session = await getServerAuthSession();
  const user = session?.user;
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="#">
        <Rocket className="mr-2 h-6 w-6" />
        <span className="font-bold">Startpad</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Program
          </Link>
        </Button>
        <Button variant="ghost">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="/startup"
          >
            Companies
          </Link>
        </Button>
        <Button variant="ghost">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Jobs
          </Link>
        </Button>
        <Button variant="ghost">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Resources
          </Link>
        </Button>
        {!user && (
          <Button className="bg-primary">
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="/signin"
            >
              Login
            </Link>
          </Button>
        )}
        {user && (
          <Button className="bg-primary">
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </Button>
        )}
      </nav>
    </header>
  );
}

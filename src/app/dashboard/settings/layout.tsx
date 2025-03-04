import DashboardNav from "@/app/_components/DashboardNav";
import SettingsNavBar from "@/app/_components/SettingsNavBar";
import { getServerAuthSession } from "@/server/auth";
import { getImageURL } from "@/server/queries";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  if (!session) return redirect("/signin");
  const image_url = await getImageURL(session?.user.image);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardNav logo={image_url} />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNavBar />
          <div className="grid gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

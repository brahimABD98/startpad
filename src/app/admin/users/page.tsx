import DashboardNav from "@/app/_components/DashboardNav";
import DashboardSideBar from "@/app/_components/DashboardSideBar";
import { getImageURL, getUserData, getUsersList } from "@/server/queries";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "../../_components/data-table";
import { columns } from "./columns";

export default async function page() {
  const user = await getUserData();
  if (user?.role !== "admin") {
    return redirect("/dashboard");
  }
  const users = await getUsersList();
  if (!users) return null;
  const image_url = await getImageURL(user.image);

  return (
    <div className="flex h-screen flex-col">
      <DashboardNav logo={image_url} />
      <div className="flex flex-1 justify-around p-4">
        <DashboardSideBar />
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}

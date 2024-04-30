import React from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function page() {
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          You can edit your account information here.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

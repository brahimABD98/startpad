import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Input } from "@/components/ui/input";
import { createStartup } from "@/server/actions";
export default function AddStartup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Startup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new startup</DialogTitle>
          <DialogDescription>you can add a new startup here.</DialogDescription>
        </DialogHeader>
        <form action={createStartup}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="mt-4">
              Name
            </Label>
            <Input
              required
              type="text"
              name="name"
              placeholder="pick a startup name"
            />
            <Label htmlFor="description" className="mt-4">
              Description
            </Label>
            <Input
              type="text"
              id="description"
              required
              name="description"
              placeholder="write a breif description about your startup"
            />
            <Input type="date" required id="foundedAt" name="foundedAt" />
            <Input type="file" required id="logo" name="logo" />
          </div>
          <div className="pt-2">
            <Button type="submit">submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

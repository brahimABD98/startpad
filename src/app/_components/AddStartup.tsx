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
        <form>
          <fieldset className="flex flex-col gap-2">
            <Label htmlFor="name" className="mt-4">
              Name
            </Label>
            <Input type="text" id="name" placeholder="pick a startup name" />
            <Label htmlFor="description" className="mt-4">
              Description
            </Label>
            <Input
              type="text"
              name="description"
              placeholder="write a breif description about your startup"
            />
          </fieldset>
          <div className="pt-2">
            <Button type="submit">submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { z } from "zod";
import React from "react";
import { Input } from "@/components/ui/input";
import { createStartup } from "@/server/actions";
import { PlusCircle } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { insertStartupSchema } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
export default function AddStartup() {
  type Inputs = z.infer<typeof insertStartupSchema>;
  const form = useForm<Inputs>({
    resolver: zodResolver(insertStartupSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("foundedAt", data.foundedAt);
    formData.append("logo", data.logo as Blob);

    await createStartup(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Startup
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new startup</DialogTitle>
          <DialogDescription>you can add a new startup here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="mt-4">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        name="name"
                        placeholder="pick a startup name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description" className="mt-4">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="description"
                        name="description"
                        placeholder="write a breif description about your startup"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        id="foundedAt"
                        name="foundedAt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Input
                onChange={(e) => {
                  if (e.target.files?.[0])
                    form.setValue("logo", e.target.files[0]);
                }}
                type="file"
                id="logo"
                name="logo"
              />
            </div>
            <div className="pt-2">
              <Button type="submit">submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

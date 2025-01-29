"use client";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertConferenceSchema } from "@/server/db/schema";
import type { z } from "zod";
import { Input } from "@/components/ui/input";

import { createConfernence } from "@/server/actions";
import { Textarea } from "@/components/ui/textarea";
export default function CreateConfernence({
  startup_id,
}: Readonly<{
  startup_id: string;
}>) {
  type Inputs = z.infer<typeof insertConferenceSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(insertConferenceSchema),
    defaultValues: {
      startup_id,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createConfernence(data);
  };
  const { formState } = form;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Create Conference
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conference</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new conference and invite your team members.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Please Enter a conference Name"
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
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Please Enter a conference description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startup_id"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="py-4">
              <Button disabled={formState.isSubmitting} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

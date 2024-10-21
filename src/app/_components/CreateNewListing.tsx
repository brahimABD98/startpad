"use client";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { insertJobListingSchema } from "@/server/db/schema";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobListing } from "@/server/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
export default function CreateNewListing({ id }: { id: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  type Inputs = z.infer<typeof insertJobListingSchema>;
  const form = useForm<Inputs>({
    defaultValues: {
      payrange: "",
      responsabilities: "",
      requirements: "",
    },
    resolver: zodResolver(insertJobListingSchema),
  });
  const { setValue, formState } = form;
  useEffect(() => {
    setValue("startup_id", id);
  }, [id, setValue]);
  const handleSubmit: SubmitHandler<Inputs> = async (data) => {
    await createJobListing(data);
    setIsDialogOpen(false);
    form.reset({
      description: "",
      location: "",
      title: "",
      type: "",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Listing</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Optional:</FormLabel>
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="payrange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Range</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example: 150k $"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsablilities</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startup_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={formState.isSubmitting} type="submit">
              {formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

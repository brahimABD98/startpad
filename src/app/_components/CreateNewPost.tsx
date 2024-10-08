"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { createPost } from "@/server/actions";
import TextEditor from "./TextEditor";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { insertPostSchema } from "@/server/db/schema";
export default function CreateNewPost({ startup_id }: { startup_id: string }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    setValue("startup_id", startup_id);
  }, [startup_id]);

  type Inputs = z.infer<typeof insertPostSchema>;
  useEffect(() => {
    setValue("content", content);
  }, [content]);
  const form = useForm<Inputs>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      media: undefined,
    },
  });
  const { setValue, formState } = form;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("media media", data.media);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("startup_id", startup_id);
    formData.append("is_pinned", data.is_pinned ? "true" : "false");
    if (data.media) {
      formData.append("media", data.media as Blob);
    }
    await createPost(formData)
      .then((v) => {
        console.log(v);
        setContent("");
        form.reset({
          title: "",
          is_pinned: false,
          content: "",
          media: undefined,
        });
      })
      .catch(() => console.log("error"));
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <h3 className="mb-4 text-lg font-semibold">Create a new post</h3>
            <FormField
              name="is_pinned"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row">
                  <FormControl>
                    <Checkbox
                      checked={field.value!}
                      onCheckedChange={field.onChange}
                      className="mr-2 h-7 w-7 "
                    />
                  </FormControl>
                  <FormLabel>Mark this as pinned</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent className="p-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Post title:</FormLabel>
                  <FormControl>
                    <Input {...field} className="mr-2 h-7 w-full md:w-1/2 " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <TextEditor content={content} setContent={setContent} />
                <FormField
                  name="content"
                  control={form.control}
                  render={({}) => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="media"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file); // Update the form state with the selected file
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          type="file"
                          id="media"
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-2 flex items-center justify-end space-x-2">
                  <Button disabled={formState.isSubmitting} type="submit">
                    {formState.isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

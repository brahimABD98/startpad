"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useState, useEffect } from "react";
import { createPost } from "@/server/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import TextEditor from "./TextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateNewPostSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import type { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
export default function CreateNewPost() {
  const [content, setContent] = useState("");
  type Inputs = z.infer<typeof CreateNewPostSchema>;
  useEffect(() => {
    setValue("postContent", content);
  }, [content]);
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateNewPostSchema),
  });
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
  };
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="markpinned"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Mark this post as pinned</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Post</Button>
        </form>
      </Form>
      {errors && (
        <h1>
          {errors.postContent?.message}
          {errors.markpinned?.message}
        </h1>
      )}
      <form action="">
        <CardHeader>
          <h3 className="mb-4 text-lg font-semibold">Create a new post</h3>
          <Label htmlFor="markPinned" className="flex flex-row items-center">
            <Input
              type="checkbox"
              id="markPinned"
              name="isAnnouncement"
              className="mr-2 h-6 w-6"
            />
            Mark this as an Announcement
          </Label>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <TextEditor setContent={setContent} />
              <input type="hidden" name="PostContent" value={content} />
              <div className="mt-2 flex items-center justify-end space-x-2">
                <Button size="sm" type="submit">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

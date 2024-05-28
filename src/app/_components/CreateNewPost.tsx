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
import { CreateNewPostSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import type { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserWithStartups } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function CreateNewPost({ user }: { user: UserWithStartups }) {
  const [content, setContent] = useState("");

  type Inputs = z.infer<typeof CreateNewPostSchema>;
  useEffect(() => {
    setValue("postContent", content);
  }, [content]);
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateNewPostSchema),
  });
  const { setValue } = form;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createPost(data)
      .then((v) => {
        console.log(v);
        setContent("");
        localStorage.removeItem("textEditorData");
        form.reset({
          title: "",
          markpinned: false,
          postContent: "",
          author_id: "",
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
              name="markpinned"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
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
                  <FormLabel>Mark this as pinned</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <TextEditor setContent={setContent} />
                <FormField
                  name="postContent"
                  control={form.control}
                  render={({}) => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-2 flex items-center justify-end space-x-2">
                  <Button size="sm" type="submit">
                    Post
                  </Button>
                  <FormField
                    name="author_id"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Post as" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                  {user.startups.map((startup) => (
                                    <SelectItem
                                      key={`${startup.id}`}
                                      value={`${startup.id}`}
                                    >
                                      {startup.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

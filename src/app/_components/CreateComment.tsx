"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addPostComment } from "@/server/actions";
import { insertPostCommentSchema, type SelectUser } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
type Inputs = z.infer<typeof insertPostCommentSchema>;
export default function CreateComment({
  user_avatar,
  user,
  post_id,
}: Readonly<{ user_avatar: string; user: SelectUser; post_id: string }>) {
  const form = useForm<Inputs>({
    resolver: zodResolver(insertPostCommentSchema),
  });
  const { setValue } = form;
  useEffect(() => {
    setValue("user_id", user.id);
    setValue("post_id", post_id);
  }, [setValue, user.id, post_id]);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addPostComment(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Avatar>
                <AvatarImage src={user_avatar} alt={user.name ?? "user"} />
                <AvatarFallback>
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Comment"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="post_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

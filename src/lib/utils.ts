import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import * as schema from "@/server/db/schema";
import {
  ExtractTablesWithRelations,
  DBQueryConfig,
  BuildQueryResult,
} from "drizzle-orm";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidURL(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function generateConferenceId() {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
  const new_id = nanoid();
  return new_id.match(/.{1,4}/g)?.join("-") ?? new_id;
}
export const getDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
export const getTime = (date: string) => {
  return new Date(date).toLocaleTimeString();
};

// typesafe fetch

const get = async (url: string, input: Record<string, string>) => {
  return fetch(`${url}?${new URLSearchParams(input).toString()}`);
};

const post = async (url: string, input: Record<string, string>) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(input),
  });
};

const postForm = async (url: string, input: FormData) => {
  return fetch(url, {
    method: "POST",
    body: input,
  });
};

type CreateAPIMethod = <TInput extends Record<string, string>, TOutput>(opts: {
  url: string;
  method: "GET" | "POST";
}) => (input: TInput) => Promise<TOutput>;

export const createAPIMethod: CreateAPIMethod = (opts) => (input) => {
  const method = opts.method === "GET" ? get : post;

  return (
    method(opts.url, input)
      // Imagine error handling here...
      .then((res) => res.json())
  );
};

type CreateAPIFormMethod = <TOutput>(opts: {
  url: string;
  method: "POST";
}) => (input: FormData) => Promise<TOutput>;

export const createAPIFormMethod: CreateAPIFormMethod = (opts) => (input) => {
  return (
    postForm(opts.url, input)
      // Imagine error handling here...
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      })
  );
};

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName>,
> = BuildQueryResult<TSchema, TSchema[TableName], { with: With }>;

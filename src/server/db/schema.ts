import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customAlphabet } from "nanoid";
import { generateConferenceId } from "@/lib/utils";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `startpad_${name}`);

const nanoid = customAlphabet("abcdefghijklmnpqrstuvwxyz0123456789", 14);
export const job_listings = createTable("job_listings", {
  id: varchar("id", { length: 18 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  payrange: varchar("payrange", { length: 255 }),
  responsabilities: text("responsabilities"),
  requirements: text("requirements"),
  type: varchar("type", { length: 255 }).notNull(),
  description: text("description").notNull(),
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  startup_id: varchar("startup_id")
    .references(() => startups.id)
    .notNull(),
});
export const followed_startups = createTable("followed_startups", {
  id: varchar("id", { length: 18 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  user_id: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  startup_id: varchar("startup_id", { length: 18 })
    .references(() => startups.id)
    .notNull(),
  created_at: timestamp("created_at"),
});
export const post_comment = createTable("post_comment", {
  id: varchar("id", { length: 18 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  post_id: varchar("post_id", { length: 18 })
    .references(() => posts.id)
    .notNull(),
  user_id: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  moderation_id: varchar("moderation_id", { length: 42 }),
});
export const post_likes = createTable("post_likes", {
  id: varchar("id", { length: 18 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  post_id: varchar("post_id", { length: 18 })
    .references(() => posts.id)
    .notNull(),
  user_id: varchar("user_id", { length: 255 }),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const job_applications = createTable("job_application", {
  id: varchar("id", { length: 18 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  job_id: varchar("job_id", { length: 18 })
    .references(() => job_listings.id)
    .notNull(),
  user_id: varchar("user_id")
    .references(() => users.id)
    .notNull(),
  resume: varchar("resume").references(() => files.id),
  cover_letter: varchar("cover_letter").references(() => files.id),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const conferences = createTable("conferences", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateConferenceId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startDate: timestamp("startDate", { mode: "string" }).notNull(),
  startup_id: varchar("startup_id")
    .references(() => startups.id)
    .notNull(),
});

export const conferenceSpeakers = createTable("conference_speakers", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  conferenceId: varchar("conferenceId", { length: 255 })
    .references(() => conferences.id)
    .notNull(),
  speakerId: varchar("speakerId", { length: 255 })
    .references(() => users.id)
    .notNull(),
});
export const posts = createTable(
  "post",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    user_id: varchar("user_id", { length: 255 }).references(() => users.id),
    startup_id: varchar("startup_id").references(() => startups.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    is_pinned: boolean("is_pinned").default(false),
    content: text("content").notNull(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.user_id),
    createdBySidIdx: index("createdByStartup_idx").on(example.startup_id),
    nameIndex: index("name_idx").on(example.title),
  }),
);

export const postimages = createTable(
  "post_images",
  {
    postId: varchar("postId")
      .references(() => posts.id)
      .notNull(),
    fileId: varchar("file")
      .references(() => files.id)
      .notNull(),
    uploadedAt: timestamp("uploadedAt"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.fileId] }),
  }),
);

export const startups = createTable("startup", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  foundedAt: timestamp("foundedAt", { mode: "date" }).notNull(),
  logo: text("logo").notNull(),
  founderId: varchar("founderId", { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const files = createTable("file", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  bucket: varchar("bucket", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  size: integer("size").notNull(),
  moderation_id: varchar("moderation_id", { length: 42 }),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 255 }),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: varchar("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type SelectUser = typeof users.$inferSelect;
export type SelectStartups = typeof startups.$inferSelect;

export type SelectPosts = typeof posts.$inferSelect;
export type StartupWithPosts = SelectStartups & {
  posts: SelectPosts[];
};

export type UserWithStartups = SelectUser & {
  startups: SelectStartups[];
};

export const jobApplicationsRelations = relations(
  job_applications,
  ({ one }) => ({
    resume: one(files, {
      fields: [job_applications.resume],
      references: [files.id],
      relationName: "resume",
    }),
    coverLetter: one(files, {
      fields: [job_applications.cover_letter],
      references: [files.id],
      relationName: "coverLetter",
    }),
    user: one(users, {
      fields: [job_applications.user_id],
      references: [users.id],
    }),
    job: one(job_listings, {
      fields: [job_applications.job_id],
      references: [job_listings.id],
    }),
  }),
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
  postImages: many(postimages),
  createdByStartup: one(startups, {
    fields: [posts.startup_id],
    references: [startups.id],
  }),
  postsLikes: many(post_likes),
  postComments: many(post_comment),
}));

export const jobListingsRelations = relations(
  job_listings,
  ({ one, many }) => ({
    startup: one(startups, {
      fields: [job_listings.startup_id],
      references: [startups.id],
    }),
    jobApplications: many(job_applications),
  }),
);

export const startupsRelations = relations(startups, ({ one, many }) => ({
  founder: one(users, { fields: [startups.founderId], references: [users.id] }),
  jobListings: many(job_listings),
  followedBy: many(followed_startups),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const folllowedStartupsRelations = relations(
  followed_startups,
  ({ one }) => ({
    startup: one(startups, {
      fields: [followed_startups.startup_id],
      references: [startups.id],
    }),
    user: one(users, {
      fields: [followed_startups.user_id],
      references: [users.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  startups: many(startups),
  posts: many(posts),
  conferenceSpeakers: many(conferenceSpeakers),
  jobApplications: many(job_applications),
  postComments: many(post_comment),
  postLikes: many(post_likes),
  followedStartups: many(followed_startups),
}));
export const postCommentsRelations = relations(post_comment, ({ one }) => ({
  post: one(posts, { fields: [post_comment.post_id], references: [posts.id] }),
  user: one(users, { fields: [post_comment.user_id], references: [users.id] }),
}));
export const postLikesRelations = relations(post_likes, ({ one }) => ({
  post: one(posts, { fields: [post_likes.post_id], references: [posts.id] }),
  user: one(users, { fields: [post_likes.user_id], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const fileRelations = relations(files, ({ many }) => ({
  postImages: many(postimages),
  jobApplicationsResume: many(job_applications, { relationName: "resume" }),
  jobApplicationsCoverLetter: many(job_applications, {
    relationName: "coverLetter",
  }),
}));

export const postImagesRelations = relations(postimages, ({ one }) => ({
  post: one(posts, { fields: [postimages.postId], references: [posts.id] }),
  file: one(files, { fields: [postimages.fileId], references: [files.id] }),
}));

export const conferenceRelations = relations(conferences, ({ many }) => ({
  conferencespeakers: many(conferenceSpeakers),
}));

export const conferenceSpeakersRelations = relations(
  conferenceSpeakers,
  ({ one }) => ({
    conference: one(conferences, {
      fields: [conferenceSpeakers.conferenceId],
      references: [conferences.id],
    }),
    speaker: one(users, {
      fields: [conferenceSpeakers.speakerId],
      references: [users.id],
    }),
  }),
);

//zod
export const fileSchema = z.instanceof(File).refine(
  (file) => {
    if (!file || !(file instanceof File)) return true;
    return (
      file.type.startsWith("image/") &&
      file.size > 0 &&
      file.size < 4 * 1024 * 1024
    );
  },
  {
    message:
      "File must be an image type and its size must be greater than 0 and less than 4 MB",
  },
);

export const documentSchema = z.instanceof(File).refine(
  (file) => {
    if (!file || !(file instanceof File)) return true;
    return (
      // ALLOWED_DOCUMENTS_MIMES.includes(file.type) &&
      file.size > 0 && file.size < 20 * 1024 * 1024
    );
  },
  { message: "Document must be a doc or pdf file and less than 20 MB" },
);
export const insertStartupSchema = createInsertSchema(startups, {
  logo: fileSchema.optional(),
  foundedAt: z
    .string()
    .refine((date) => new Date(date).toISOString() !== "Invalid Date")
    .default(() => new Date().toISOString()),
}).omit({ founderId: true });
export const insertConferenceSchema = createInsertSchema(conferences);
export const insertPostCommentSchema = createInsertSchema(post_comment).omit({
  moderation_id: true,
  created_at: true,
  id: true,
});
export const selectJobListingSchema = createSelectSchema(job_listings);
export const uuidSchema = z.string().uuid();
export const insertJobListingSchema = createInsertSchema(job_listings).omit({
  created_at: true,
  id: true,
});
export const insertJobApplicationSchema = createInsertSchema(job_applications, {
  cover_letter: documentSchema,
  resume: documentSchema,
}).omit({
  created_at: true,

  id: true,
});

export const insertPostSchema = createInsertSchema(posts, {
  is_pinned: z.coerce.boolean().default(false),
  content: z.string().refine(
    (content) => {
      const regex = /(<([^>]+)>)/gi;
      const clean_content = content.replace(regex, "");
      return !!clean_content.trim().length;
    },
    { message: "Post content cannot be empty" },
  ),
})
  .omit({ user_id: true })
  .extend({
    media: z.any(),
  });

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `startpad_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    createdByUser: varchar("createdById", { length: 255 }).references(
      () => users.id,
    ),
    createdByStartup: integer("createdByStartup").references(() => startups.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    is_pinned: boolean("is_pinned").default(false),
    content: text("content").notNull(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdByUser),
    createdBySidIdx: index("createdByStartup_idx").on(example.createdByStartup),
    nameIndex: index("name_idx").on(example.title),
  }),
);

export const postimages = createTable(
  "post_images",
  {
    postId: integer("postId").references(() => posts.id),
    fileId: integer("file").references(() => files.id),
    uploadedAt: timestamp("uploadedAt"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.fileId] }),
  }),
);

export const startups = createTable("startup", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  foundedAt: timestamp("foundedAt", { mode: "date" }).notNull(),
  logo: text("logo").notNull(),
  founderId: varchar("founderId", { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const files = createTable("file", {
  id: serial("id").primaryKey(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  bucket: varchar("bucket", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  size: integer("size").notNull(),
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
    expires_at: integer("expires_at"),
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

export const postsRelations = relations(posts, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [posts.createdByUser],
    references: [users.id],
  }),
  postImages: many(postimages),
  createdByStartup: one(startups, {
    fields: [posts.createdByStartup],
    references: [startups.id],
  }),
}));

export const startupsRelations = relations(startups, ({ one }) => ({
  founder: one(users, { fields: [startups.founderId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  startups: many(startups),
  posts: many(posts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const fileRelations = relations(files, ({ many }) => ({
  postImages: many(postimages),
}));

export const postImagesRelations = relations(postimages, ({ one }) => ({
  post: one(posts, { fields: [postimages.postId], references: [posts.id] }),
  file: one(files, { fields: [postimages.fileId], references: [files.id] }),
}));

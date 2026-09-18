import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const signingStatusEnum = pgEnum("signing_status", ["draft"]);

export const signings = pgTable("signings", {
  id: uuid("id").primaryKey(),
  documentName: text("document_name").notNull(),
  message: text("message").notNull().default(""),
  documentKey: text("document_key").notNull(),
  status: signingStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const signers = pgTable("signers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  signingId: uuid("signing_id")
    .notNull()
    .references(() => signings.id),
  name: text("name").notNull(),
  taxIdentificationNumber: text("tax_identification_number").notNull(),
  email: text("email").notNull(),
});

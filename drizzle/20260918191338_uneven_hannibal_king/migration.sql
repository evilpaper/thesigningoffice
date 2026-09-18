CREATE TYPE "signing_status" AS ENUM('draft');--> statement-breakpoint
CREATE TABLE "signers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "signers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"signing_id" uuid NOT NULL,
	"name" text NOT NULL,
	"tax_identification_number" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signings" (
	"id" uuid PRIMARY KEY,
	"document_name" text NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"document_key" text NOT NULL,
	"status" "signing_status" DEFAULT 'draft'::"signing_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "signers" ADD CONSTRAINT "signers_signing_id_signings_id_fkey" FOREIGN KEY ("signing_id") REFERENCES "signings"("id");
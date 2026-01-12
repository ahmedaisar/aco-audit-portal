CREATE TYPE "public"."priority" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TYPE "public"."tab_type" AS ENUM('RAS', 'COB', 'AHR');--> statement-breakpoint
CREATE TABLE "analytics" (
	"page_name" text PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "change_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"tab_type" "tab_type" NOT NULL,
	"requestor_name" text NOT NULL,
	"department" text NOT NULL,
	"email_id" text NOT NULL,
	"today_date" text NOT NULL,
	"priority" "priority" NOT NULL,
	"url" text NOT NULL,
	"page_name" text NOT NULL,
	"change_description" text NOT NULL,
	"desired_go_live_date" text NOT NULL,
	"resort_name" text,
	"resort_ops_contact" text,
	"checklist_data" jsonb,
	"notes_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "request_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" text NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "request_files" ADD CONSTRAINT "request_files_request_id_change_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."change_requests"("id") ON DELETE cascade ON UPDATE no action;
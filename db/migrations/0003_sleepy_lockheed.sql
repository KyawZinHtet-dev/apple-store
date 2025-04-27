CREATE TABLE "email_verification_token" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;
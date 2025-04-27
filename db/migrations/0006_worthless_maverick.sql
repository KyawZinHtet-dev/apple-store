CREATE TABLE "two_factor_code" (
	"id" text NOT NULL,
	"code" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	"user_id" text,
	CONSTRAINT "two_factor_code_email_code_pk" PRIMARY KEY("email","code")
);
--> statement-breakpoint
ALTER TABLE "two_factor_code" ADD CONSTRAINT "two_factor_code_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
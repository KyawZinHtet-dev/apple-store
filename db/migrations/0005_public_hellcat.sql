CREATE TABLE "password_reset_token" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password_reset_token_email_token_pk" PRIMARY KEY("email","token")
);

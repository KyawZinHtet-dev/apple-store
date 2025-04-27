CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"price" integer,
	"created_at" timestamp DEFAULT now()
);

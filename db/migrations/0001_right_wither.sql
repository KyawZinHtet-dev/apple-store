ALTER TABLE "user" ADD COLUMN "roles" "roles" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isTwoFactorEnabled" boolean DEFAULT false;
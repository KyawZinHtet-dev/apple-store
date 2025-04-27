ALTER TABLE "order_product" ADD COLUMN "order_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerId" text;--> statement-breakpoint
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "variant" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "variant_image" (
	"id" text PRIMARY KEY NOT NULL,
	"variantId" text NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"order" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"variantId" text NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "variant" ADD CONSTRAINT "variant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_image" ADD CONSTRAINT "variant_image_variantId_variant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_tag" ADD CONSTRAINT "variant_tag_variantId_variant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;
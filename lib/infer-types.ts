import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/db/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantsWithImagesTags = InferResultType<
  "variants",
  { variantImages: true; variantTags: true }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  { variants: true }
>;

export type VariantsWithProduct = InferResultType<
  "variants",
  { products: true; variantImages: true; variantTags: true }
>;

export type ProductsWithVariantsAndImages = InferResultType<
  "products",
  { variants: { with: { variantImages: true; variantTags: true } } }
>;

export type OrdersWithUsersAndOrderProducts = InferResultType<
  "orders",
  {
    orderProduct: {
      with: { product: true; variant: { with: { variantImages: true } } };
    };
  }
>;

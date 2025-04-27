import Products from "@/components/products";
import MainLayout from "./main-layout";
import { db } from "@/db/db_connection";
import SearchBox from "@/components/products/search-box";
import TagFilter from "@/components/products/tag-filter";
import { variantTags } from "@/db/schema";

export default async function Home() {
  const prductsWithVariantsAndImages = await db.query.products.findMany({
    with: { variants: { with: { variantImages: true, variantTags: true } } },
    orderBy: (products, { desc }) => [desc(products.updatedAt)],
  });

  return (
    <MainLayout>
      <SearchBox prductsWithVariantsAndImages={prductsWithVariantsAndImages} />
      <Products products={prductsWithVariantsAndImages} />
    </MainLayout>
  );
}

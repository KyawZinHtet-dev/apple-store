import MainLayout from "@/app/main-layout";
import { db } from "@/db/db_connection";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import SingleProduct from "@/components/products/single-product";

type ProductDetailsProps = Promise<{ id: string }>;

export async function generateStaticParams() {
  const products = await db.query.products.findMany({
    with: { variants: { with: { variantImages: true, variantTags: true } } },
    orderBy: (products, { desc }) => [desc(products.updatedAt)],
  });
  if (products) {
    const productsId = products.map((product) => ({
      id: product.id,
    }));
    return productsId;
  }
  return [];
}

const ProductDetails = async (props: { params: ProductDetailsProps }) => {
  const { id } = await props.params;
  const singleProduct = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { variants: { with: { variantImages: true, variantTags: true } } },
  });

  return (
    <MainLayout>
      <SingleProduct product={singleProduct!} />
    </MainLayout>
  );
};

export default ProductDetails;

import PremiumHome from "@/components/PremiumHome";
import { getBestsellers } from "@/data/product-store";

export const revalidate = 60;
export default async function HomePage() {
  return <PremiumHome products={await getBestsellers()} />;
}

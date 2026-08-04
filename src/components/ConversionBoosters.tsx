import { getBestsellers } from "@/data/products";
import SocialProofToast from "./SocialProofToast";
import ExitIntentPopup from "./ExitIntentPopup";

export default function ConversionBoosters() {
  const bestsellers = getBestsellers();

  const toastProducts = bestsellers.slice(0, 15).map((p) => ({
    title: p.title,
    image: p.images[0],
    price: p.price,
    slug: p.slug,
  }));

  return (
    <>
      <SocialProofToast products={toastProducts} />
      <ExitIntentPopup />
    </>
  );
}

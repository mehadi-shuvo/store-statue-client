import FeaturedCategories from "@/components/FeaturedCategories";
import GiftCArdSm from "@/components/giftCard/GiftCardSm";
import GiftCardTwo from "@/components/GiftCardTwo";
import ImageSlider from "@/components/ImageSlider";
import ItemsTab from "@/components/ItemsTab";
import ProductCard from "@/components/ProductCard";
import { ProductsGrid } from "@/components/ProductsGrid";
import SectionHeader from "@/components/SectionHeader";
import TopUpSection from "@/components/TopUpSection";
import TrustBar from "@/components/trustBar/TrustBar";
import WhyChooseUs from "@/components/WhyChooseUs";
import { giftCards } from "@/utils/giftCardData";

export default async function Home() {
  const sliderImages = [
    {
      src: "/slider1.jpg",
      alt: "Beautiful landscape with mountains",
    },
    {
      src: "/slider2.jpg",
      alt: "City skyline at night",
    },
    {
      src: "/slider3.jpg",
      alt: "Beach with palm trees",
    },
  ];
  return (
    <div>
      <div className="w-4/5 mx-auto pt-[148px] pb-10">
        <ImageSlider images={sliderImages} autoPlayInterval={9000} />
      </div>

      <TrustBar />

      <FeaturedCategories />

      {/* ==== Latest Accessories Section ==== */}
      <SectionHeader
        title="Latest Accessories"
        subtitle="Cutting-edge gadgets for modern life"
        href="/products?category=accessories"
        badge="New"
      />

      <ProductsGrid />

      {/* Gift Card Grid Section */}
      <SectionHeader
        title="Popular Gift Cards"
        subtitle="Top brands at the best prices"
        href="/gift-cards"
      />

      <section className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {giftCards.map((card) => (
            <GiftCArdSm
              key={card.id}
              id={card.id}
              brand={card.brand}
              title={card.title}
              image={card.image}
              startingPrice={card.amounts[0]?.cardUSD || 0}
              currency={card.currency}
            />
          ))}
        </div>
      </section>

      <WhyChooseUs />
    </div>
  );
}

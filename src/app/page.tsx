import GiftCard from "@/components/GiftCard";
import GiftCardTwo from "@/components/GiftCardTwo";
import ImageSlider from "@/components/ImageSlider";
import ItemsTab from "@/components/ItemsTab";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import TopUpSection from "@/components/TopUpSection";

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
      <div className="w-[90%] md:w-4/5 mx-auto pt-20 pb-10">
        <ImageSlider images={sliderImages} autoPlayInterval={9000} />
      </div>
      <ItemsTab />
      <SectionHeader
        title="Latest Electronics"
        subtitle="Cutting-edge technology and innovative gadgets for modern living"
        category="electronics"
      />
      <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-3 mb-10">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <SectionHeader
        title="Gift Card"
        subtitle="Instant digital codes and in-game currency"
        category="gaming"
      />
      <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-5 mb-10">
        <GiftCardTwo
          brand="Amazon"
          title="this is amazon gift card"
          image="https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png"
        />
        <GiftCardTwo
          brand="apple"
          title="this is amazon gift card"
          image="https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png"
        />
        <GiftCardTwo
          brand="Google"
          title="this is amazon gift card"
          image="https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png"
        />
      </div>

      <SectionHeader
        title="Game Top-Up"
        subtitle="Instant digital codes and in-game currency"
        category="topup"
      />
      <TopUpSection />
    </div>
  );
}

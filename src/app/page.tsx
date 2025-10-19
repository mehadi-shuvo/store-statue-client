import GameTopUpCard from "@/components/GameTopUpCard";
import GiftCard from "@/components/GiftCard";
import GamingCard from "@/components/GiftCard";
import ImageSlider from "@/components/ImageSlider";
import ItemsTab from "@/components/ItemsTab";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";

export default function Home() {
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
      <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-3 mb-10">
        <GiftCard
          brand="Amazon"
          title="Amazon Gift Card"
          image="https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg"
          // onAddToCart={(amount) =>
          //   console.log(`Added $${amount} Amazon card to cart`)
          // }
          // onInstantBuy={(amount) =>
          //   console.log(`Instant buy $${amount} Amazon card`)
          // }
        />

        <GiftCard
          brand="Steam"
          title="Steam Wallet Code"
          image="https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg"
          currency="$"
        />
        <GiftCard
          brand="PlayStation"
          title="PSN Digital Card"
          image="https://images.pexels.com/photos/7005690/pexels-photo-7005690.jpeg"
        />
      </div>

      <SectionHeader
        title="Game Top-Up"
        subtitle="Instant digital codes and in-game currency"
        category="topup"
      />
      <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-3 mb-10">
        <GameTopUpCard />
        <GameTopUpCard />
        <GameTopUpCard />
      </div>
    </div>
  );
}

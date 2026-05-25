import GiftCardTwo from "@/components/GiftCardTwo";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-5 mb-10 mt-[148px]">
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
    </div>
  );
};

export default page;

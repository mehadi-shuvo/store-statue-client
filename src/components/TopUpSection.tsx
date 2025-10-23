import React from "react";
import topUpData from "../../public/data/topup-data.json";
import { TTopUpData } from "@/types/top-up/topUpCardType";
import GameTopUpCard from "./GameTopUpCard";

const TopUpSection = () => {
  return (
    <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-3 mb-10">
      {topUpData.map((item: TTopUpData) => (
        <GameTopUpCard key={item.id} topUpDataObject={item} />
      ))}
    </div>
  );
};

export default TopUpSection;

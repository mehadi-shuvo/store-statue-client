import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GameTopUpPreviewDialog from "./GameTopUpPreviewDialog";
import type { GameTopUp } from "@/types/game-top-up";

const game: GameTopUp = { id:"g1",name:"Free Fire",title:"Free Fire Diamonds",slug:"free-fire",description:"Top up your game balance",subHeading:"Diamonds Top-Up",logoUrl:"/window.svg",bannerUrl:"/window.svg",gameCurrencyName:"Diamonds",fulfillmentType:"PLAYER_ID",status:"ACTIVE",isActive:true,isFeatured:false,sortOrder:0,accountFields:[],packages:[{id:"p1",gameId:"g1",name:"100 Diamonds",coinAmount:100,bonusAmount:0,priceBdt:"90.00",isActive:true,isPopular:true,sortOrder:0,stockQuantity:null}] };

describe("GameTopUpPreviewDialog",()=>{
  it("reuses the customer card with real game and BDT package data",()=>{const close=vi.fn();render(<GameTopUpPreviewDialog game={game} open onClose={close}/>);expect(screen.getByRole("dialog")).toBeInTheDocument();expect(screen.getByText("Free Fire")).toBeInTheDocument();expect(screen.getByRole("img",{name:"Free Fire logo"})).toHaveAttribute("src",expect.stringContaining("window.svg"));expect(screen.getAllByText(/৳90\.00/).length).toBeGreaterThan(0);expect(screen.queryByRole("link")).not.toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Close preview"}));expect(close).toHaveBeenCalledOnce();});
  it("shows a safe empty-package state instead of crashing",()=>{render(<GameTopUpPreviewDialog game={{...game,packages:[]}} open onClose={()=>undefined}/>);expect(screen.getByRole("button",{name:/Packages not configured/})).toBeDisabled();});
  it("closes with Escape",()=>{const close=vi.fn();render(<GameTopUpPreviewDialog game={game} open onClose={close}/>);fireEvent.keyDown(window,{key:"Escape"});expect(close).toHaveBeenCalledOnce();});
});

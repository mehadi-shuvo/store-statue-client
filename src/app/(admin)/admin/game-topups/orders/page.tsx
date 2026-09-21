import AdminTopUpQueue from "@/components/admin/game-top-up/AdminTopUpQueue";
export default async function Page({searchParams}:{searchParams:Promise<{gameId?:string}>}){const {gameId=""}=await searchParams;return <AdminTopUpQueue initialGameId={gameId}/>;}

import AdminGameManager from "@/components/admin/game-top-up/AdminGameManager";
export default async function Page({params}:{params:Promise<{gameId:string}>}){const {gameId}=await params;return <AdminGameManager gameId={gameId}/>;}

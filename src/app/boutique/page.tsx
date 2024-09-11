"use client"

import ListCards from "../components/List/List"
import { useData } from "../contexts/data"

export default function Boutique (){
    const data = useData();
    const shop = data.shop;
    return (
        <main className="sm:pt-[10vh] md:pt-[10vh] flex flex-col items-center gap-4 p-4">
            <h1 className="text-6xl">Boutique en ligne</h1>
            <ListCards shop={shop}/>
        </main>
    )
}
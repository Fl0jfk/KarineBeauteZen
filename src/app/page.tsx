import ListCards from "./components/List/List";
import activity from "@/app/data/data.json"

export default function Home() {
  return (
    <main className="pt-[10vh]">
      <ListCards activity={activity} />
    </main>
  );
}

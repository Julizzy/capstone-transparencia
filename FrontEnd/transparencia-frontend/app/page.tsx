import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { InfoCards } from "@/components/InfoCards";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <SearchBar />
        <InfoCards />
      </div>
    </main>
  );
}

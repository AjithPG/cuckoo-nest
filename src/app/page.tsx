import { RightPanel } from "./components/RightPanel";
import { SideBar } from "./components/SideBar";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] h-[calc(100vh-64px)]">
      <SideBar />
      <main>Main section</main>
      <RightPanel />
    </div>
  );
}

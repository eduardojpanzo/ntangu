import { Header } from "@/components/section/site-header";
import "./../styles/home.css";
import { SiteBanner } from "@/components/section/site-banner";
import Recursos from "@/components/section/site-recursos";
import Depoimentos from "@/components/section/site-depoimentos";
import Precos from "@/components/section/site-precos";
import Rodape from "@/components/section/site-rodape";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <div className="absolute top-0 flex h-[150px] w-full">
        <div className="header-gradient h-full w-full"></div>
      </div>

      <Header />

      <main className="z-10">
        <SiteBanner />
        <Recursos />
        <Depoimentos />
        <Precos />
      </main>

      <Rodape />
    </div>
  );
}

import { Analytics } from "@vercel/analytics/react";
import Cabecalho from "./componentes/Cabecalho";
import Hero from "./componentes/Hero";
import Urna from "./componentes/Urna";
import FezFaz from "./componentes/FezFaz";
import Propostas from "./componentes/Propostas";
import MapaRJ from "./componentes/MapaRJ";
import PeloEstado from "./componentes/PeloEstado";
import Sobre from "./componentes/Sobre";
import Rodape from "./componentes/Rodape";

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="corpo">
        <Hero />
        <MapaRJ />
        <Urna />
        <FezFaz />
        <div className="fio-onda" aria-hidden="true" />
        <Propostas />
        <PeloEstado />
        <Sobre />
      </main>
      <Rodape />
      <Analytics />
    </>
  );
}

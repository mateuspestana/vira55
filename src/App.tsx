import { Analytics } from "@vercel/analytics/react";
import Cabecalho from "./componentes/Cabecalho";
import Hero from "./componentes/Hero";
import Urna from "./componentes/Urna";
import FezFaz from "./componentes/FezFaz";
import Duelo from "./componentes/Duelo";
import Matriz from "./componentes/Matriz";
import PeloEstado from "./componentes/PeloEstado";
import Sobre from "./componentes/Sobre";
import Rodape from "./componentes/Rodape";

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="corpo">
        <Hero />
        <Urna />
        <FezFaz />
        <div className="fio-onda" aria-hidden="true" />
        <Duelo />
        <Matriz />
        <PeloEstado />
        <Sobre />
      </main>
      <Rodape />
      <Analytics />
    </>
  );
}

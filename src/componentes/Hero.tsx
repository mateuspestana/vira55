import { useEffect, useState } from "react";
import { AVISO, DATA_EXTENSO, diasAte } from "../calendario";

export default function Hero() {
  const [dias, setDias] = useState(diasAte());
  useEffect(() => {
    const t = setInterval(() => setDias(diasAte()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {AVISO && <div className="aviso"><div className="miolo">{AVISO}</div></div>}
      <section className="hero" id="topo">
        <div className="miolo hero-grade">
          <div className="numerao-col">
            <p className="numerao" aria-label="Número 55">
              55
              <small>Digite 55 e confirme.</small>
            </p>
          </div>
          <div>
            <h1>
              Quem fez pelo Rio <em>faz</em> pelo estado inteiro.
            </h1>
            <p className="abertura">
              Fala, fluminense. No dia {DATA_EXTENSO} tem segundo turno para governador,
              e o número do Eduardo Paes é 55.
            </p>
            <div className="cta-linha">
              <a className="botao amarelo" href="#paes-ruas">Ver as propostas lado a lado</a>
              <a className="botao contorno" href="#urna">Como votar 55</a>
              <p className="contagem">
                <b>{dias}</b> {dias === 1 ? "dia" : "dias"} para votar
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

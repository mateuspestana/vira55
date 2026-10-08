import { useEntra } from "./useEntra";

export default function Urna() {
  const ref = useEntra<HTMLDivElement>();
  return (
    <section className="urna" id="urna" aria-labelledby="t-urna">
      <div className="miolo urna-grade entra" ref={ref}>
        <div>
          <h2 id="t-urna" style={{ fontSize: "var(--t-2xl)", fontWeight: 800, color: "var(--azul-fundo)" }}>
            É só digitar 5, 5 e confirmar.
          </h2>
          <ol className="passos">
            <li><span>Quando a urna pedir <b>governador</b>, aperte o <b>5</b> duas vezes.</span></li>
            <li><span>Olhe a tela: tem que aparecer o nome <b>Eduardo Paes</b>, o partido <b>PSD</b> e a foto dele.</span></li>
            <li><span>Aperte <b>CONFIRMA</b>, a tecla verde. Pronto, o voto está dado.</span></li>
          </ol>
          <p style={{ marginTop: "var(--e6)", color: "var(--tinta-2)" }}>
            Errou o número? A tecla laranja <b>CORRIGE</b> apaga e você começa de novo.
          </p>
        </div>
        <div className="urna-aparelho" role="img" aria-label="Urna eletrônica com os números 5 e 5 digitados e o nome Eduardo Paes na tela">
          <div className="urna-tela">
            <span className="cargo">Governador</span>
            <div className="tela-corpo">
              <div>
                <div className="digitos"><span>5</span><span>5</span></div>
                <div className="linha-nome">Eduardo Paes<span>Partido: PSD</span></div>
              </div>
              <img src="/paes.jpg" width="161" height="225" alt="Foto de urna de Eduardo Paes, registrada no TSE" />
            </div>
          </div>
          <div className="urna-teclas">
            {["1", "2", "3", "4"].map((n) => <span className="tecla" key={n}>{n}</span>)}
            <span className="tecla cinco">5</span>
            {["6", "7", "8", "9"].map((n) => <span className="tecla" key={n}>{n}</span>)}
            <span className="tecla">0</span>
            <span className="tecla branco">BRANCO</span>
            <span className="tecla corrige">CORRIGE</span>
            <span className="tecla confirma larga">CONFIRMA</span>
          </div>
        </div>
      </div>
    </section>
  );
}

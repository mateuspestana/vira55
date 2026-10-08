import { useMemo, useState } from "react";
import dados from "../dados/municipios.json";
import { useEntra } from "./useEntra";

type Mun = (typeof dados.municipios)[number];
const nf = new Intl.NumberFormat("pt-BR");
const pct = (a: number, b: number) => (b ? (100 * a) / b : 0);

export default function PeloEstado() {
  const ref = useEntra<HTMLDivElement>();
  const [regiao, setRegiao] = useState<string>("Todas");
  const [busca, setBusca] = useState("");
  const [todos, setTodos] = useState(false);

  const total = useMemo(() => {
    const t = { aptos: 0, abst: 0, bn: 0 };
    for (const m of dados.municipios) {
      t.aptos += m.aptos;
      t.abst += m.abst;
      t.bn += m.brancos + m.nulos;
    }
    return t;
  }, []);

  const regioes = useMemo(() => ["Todas", ...Array.from(new Set(dados.municipios.map((m) => m.r))).sort()], []);

  const lista = useMemo(() => {
    const q = busca.trim().toLocaleLowerCase("pt-BR");
    return dados.municipios
      .filter((m) => (regiao === "Todas" || m.r === regiao) && (!q || m.n.toLocaleLowerCase("pt-BR").includes(q)))
      .sort((a, b) => b.abst - a.abst);
  }, [regiao, busca]);

  const visiveis = todos || busca || regiao !== "Todas" ? lista : lista.slice(0, 12);

  return (
    <section className="estado" id="pelo-estado" aria-labelledby="t-estado">
      <div className="miolo entra" ref={ref}>
        <div className="cabeca-secao">
          <h2 id="t-estado">Município a município</h2>
          <p>
            Do Rio a Itaperuna, de Angra a Campos. Em cada município há fluminense que não foi votar
            e gente que ainda não decidiu. O 55 também é para eles.
          </p>
        </div>

        <dl className="numeros">
          <div>
            <dt>Eleitores no estado</dt>
            <dd>{nf.format(total.aptos)}</dd>
          </div>
          <div>
            <dt>Não foram votar</dt>
            <dd>
              {nf.format(total.abst)}
              <small>{pct(total.abst, total.aptos).toFixed(1).replace(".", ",")}% do eleitorado no 1º turno</small>
            </dd>
          </div>
          <div>
            <dt>Votaram em branco ou nulo</dt>
            <dd>{nf.format(total.bn)}</dd>
          </div>
          <div>
            <dt>Paes no 1º turno</dt>
            <dd>
              3.706.984
              <small>42,76% dos votos válidos para governador</small>
            </dd>
          </div>
        </dl>

        <div className="filtros" role="group" aria-label="Filtrar municípios">
          <label className="somente-leitor" htmlFor="busca-mun">Buscar município</label>
          <input id="busca-mun" type="search" placeholder="Buscar município" value={busca} onChange={(e) => setBusca(e.target.value)} />
          {regioes.map((r) => (
            <button key={r} className="chip" aria-pressed={regiao === r} onClick={() => setRegiao(r)}>{r}</button>
          ))}
        </div>

        <div className="legenda" aria-hidden="true">
          <span><i className="c-lula" />Votou Lula</span>
          <span><i className="c-flavio" />Votou Flávio Bolsonaro</span>
          <span><i className="c-outros" />Outros presidenciáveis</span>
          <span><i className="c-bn" />Branco ou nulo</span>
          <span><i className="c-abst" />Não foi votar</span>
        </div>

        <div className="tabela-estado" role="list">
          {visiveis.map((m: Mun) => (
            <div className="linha-mun" role="listitem" key={m.c}>
              <div className="nome">{m.n}<small>{m.r}</small></div>
              <div className="barra-col">
                <div className="barra" role="img" aria-label={`${m.n}: ${pct(m.lula, m.aptos).toFixed(0)}% votaram Lula, ${pct(m.flavio, m.aptos).toFixed(0)}% Flávio, ${pct(m.abst, m.aptos).toFixed(0)}% não foram votar`}>
                  <i className="c-lula" style={{ width: `${pct(m.lula, m.aptos)}%` }} />
                  <i className="c-flavio" style={{ width: `${pct(m.flavio, m.aptos)}%` }} />
                  <i className="c-outros" style={{ width: `${pct(m.outros, m.aptos)}%` }} />
                  <i className="c-bn" style={{ width: `${pct(m.brancos + m.nulos, m.aptos)}%` }} />
                  <i className="c-abst" style={{ width: `${pct(m.abst, m.aptos)}%` }} />
                </div>
              </div>
              <div className="abs">{nf.format(m.abst)}<small>não foram votar</small></div>
            </div>
          ))}
          {visiveis.length === 0 && <div className="linha-mun"><div className="nome">Nenhum município encontrado.</div></div>}
        </div>

        {!todos && !busca && regiao === "Todas" && (
          <button className="botao contorno mais" onClick={() => setTodos(true)}>Mostrar os {lista.length} municípios</button>
        )}

        <p className="nota-estado">
          As barras mostram o 1º turno para <b>presidente</b> em cada município, como retrato de onde
          está o eleitorado. Ordenado por quem não foi votar. Dados dos boletins de urna do TSE.
        </p>
      </div>
    </section>
  );
}

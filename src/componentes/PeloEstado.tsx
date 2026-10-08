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
    const t = { aptos: 0, abst: 0, bn: 0, paes: 0, validos: 0 };
    for (const m of dados.municipios) {
      t.aptos += m.aptos;
      t.abst += m.abst;
      t.bn += m.bn;
      t.paes += m.paes;
      t.validos += m.paes + m.ruas + m.outros;
    }
    return t;
  }, []);

  const regioes = useMemo(() => ["Todas", ...Array.from(new Set(dados.municipios.map((m) => m.r))).sort()], []);

  const lista = useMemo(() => {
    const q = busca.trim().toLocaleLowerCase("pt-BR");
    return dados.municipios
      .filter((m) => (regiao === "Todas" || m.r === regiao) && (!q || m.n.toLocaleLowerCase("pt-BR").includes(q)))
      .sort((a, b) => b.aptos - a.aptos);
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
            <dt>Branco e nulo</dt>
            <dd>{nf.format(total.bn)}</dd>
          </div>
          <div>
            <dt>Paes no 1º turno</dt>
            <dd>
              {nf.format(total.paes)}
              <small>{pct(total.paes, total.validos).toFixed(2).replace(".", ",")}% dos votos válidos para governador</small>
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
          <span><i className="c-paes" />Paes</span>
          <span><i className="c-ruas" />Douglas Ruas</span>
          <span><i className="c-outros" />Outros candidatos</span>
          <span><i className="c-bn" />Branco ou nulo</span>
          <span><i className="c-abst" />Não foi votar</span>
        </div>

        <div className="tabela-estado" role="list">
          {visiveis.map((m: Mun) => (
            <div className="linha-mun" role="listitem" key={m.c}>
              <div className="nome">{m.n}<small>{m.r}</small></div>
              <div className="barra-col">
                <div className="barra" role="img" aria-label={`${m.n}: Paes ${pct(m.paes, m.aptos).toFixed(0)}% do eleitorado, Douglas Ruas ${pct(m.ruas, m.aptos).toFixed(0)}%, ${pct(m.abst, m.aptos).toFixed(0)}% não foram votar`}>
                  <i className="c-paes" style={{ width: `${pct(m.paes, m.aptos)}%` }} />
                  <i className="c-ruas" style={{ width: `${pct(m.ruas, m.aptos)}%` }} />
                  <i className="c-outros" style={{ width: `${pct(m.outros, m.aptos)}%` }} />
                  <i className="c-bn" style={{ width: `${pct(m.bn, m.aptos)}%` }} />
                  <i className="c-abst" style={{ width: `${pct(m.abst, m.aptos)}%` }} />
                </div>
              </div>
              <div className="abs"><span className="v-paes">Paes {nf.format(m.paes)}</span><small>Ruas {nf.format(m.ruas)}</small></div>
            </div>
          ))}
          {visiveis.length === 0 && <div className="linha-mun"><div className="nome">Nenhum município encontrado.</div></div>}
        </div>

        {!todos && !busca && regiao === "Todas" && (
          <button className="botao contorno mais" onClick={() => setTodos(true)}>Mostrar os {lista.length} municípios</button>
        )}

        <p className="nota-estado">
          As barras mostram, para cada município, como o eleitorado se dividiu no 1º turno para governador
          (parte do total de eleitores). Ordenado por número de eleitores. Dados dos boletins de urna do TSE.
        </p>
      </div>
    </section>
  );
}

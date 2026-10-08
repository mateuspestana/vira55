import { useState } from "react";
import planos from "../conteudo/planos.json";
import aproximacoes from "../conteudo/aproximacoes.json";
import { useEntra } from "./useEntra";

type Trecho = { titulo: string; trecho: string; pagina: number };
type Cand = { nome: string; partido: string; numero: number; fonte_url: string; temas: Record<string, Trecho[] | null> };
const cands = planos.candidatos as unknown as Record<string, Cand>;
const paes = cands.paes;

const TEMAS: [string, string][] = [
  ["seguranca", "Segurança"],
  ["saude", "Saúde"],
  ["transporte", "Transporte"],
  ["economia", "Economia e emprego"],
  ["educacao", "Educação"],
  ["ambiente_saneamento", "Enchentes e obras"],
  ["interior", "Interior do estado"],
];

export default function Propostas() {
  const ref = useEntra<HTMLDivElement>();
  const disponiveis = TEMAS.filter(([k]) => paes.temas[k]?.length);
  const [tema, setTema] = useState(disponiveis[0][0]);
  const itens = paes.temas[tema] ?? [];

  return (
    <section className="duelo" id="propostas" aria-labelledby="t-propostas">
      <div className="miolo entra" ref={ref}>
        <div className="cabeca-secao">
          <h2 id="t-propostas">O que o Paes propõe para o estado</h2>
          <p>
            Trechos copiados do plano de governo que ele registrou no TSE. Votou em outro candidato
            no 1º turno? Embaixo de cada proposta você vê onde os outros planos caminham no mesmo
            sentido.
          </p>
        </div>
        <div className="abas" role="tablist" aria-label="Temas">
          {disponiveis.map(([k, nome]) => (
            <button key={k} role="tab" className="aba" aria-selected={tema === k} onClick={() => setTema(k)}>
              {nome}
            </button>
          ))}
        </div>

        <div className="propostas-lista" role="tabpanel">
          {itens.map((t, i) => {
            const parecidas = aproximacoes.filter((a) => a.paes.tema === tema && a.paes.i === i);
            return (
              <article className="proposta-paes" key={t.titulo}>
                <h3>{t.titulo}</h3>
                <blockquote>“{t.trecho}”</blockquote>
                <cite>Plano de governo de Eduardo Paes registrado no TSE, p. {t.pagina}</cite>
                {parecidas.length > 0 && (
                  <div className="parecidas">
                    <span className="parecidas-titulo">Também nessa linha</span>
                    <ul>
                      {parecidas.map((a) => {
                        const c = cands[a.cand];
                        const x = c.temas[a.tema]![a.i];
                        return (
                          <li key={a.cand + a.tema + a.i}>
                            <details>
                              <summary>
                                <span className="quem">{c.nome}<small>{c.partido}</small></span>
                                <span className={`selo-aprox ${a.rotulo === "Próximo" ? "proximo" : "mesmo"}`}>{a.rotulo}</span>
                                <span className="porque">{a.porque}</span>
                              </summary>
                              <blockquote>“{x.trecho}”</blockquote>
                              <cite>Plano de governo de {c.nome} registrado no TSE, p. {x.pagina}</cite>
                            </details>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="ponte">
          <p>Se o que você leu faz sentido, o caminho é curto. Dia 25, digite 55.</p>
          <span className="grande" aria-hidden="true">55</span>
        </div>
        <p className="nota-fonte">
          Plano completo: <a href={paes.fonte_url} target="_blank" rel="noreferrer">Eduardo Paes, no TSE</a>.
          Só aparecem aqui as propostas dos outros candidatos que são iguais, próximas ou vão no mesmo
          sentido das do Paes.
        </p>
      </div>
    </section>
  );
}

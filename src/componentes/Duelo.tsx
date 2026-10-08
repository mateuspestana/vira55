import { useState } from "react";
import planos from "../conteudo/planos.json";
import { useEntra } from "./useEntra";

type Trecho = { titulo: string; trecho: string; pagina: number };
type Cand = { nome: string; partido: string; numero: string; fonte_url: string; temas: Record<string, Trecho[] | null> };
const cands = planos.candidatos as unknown as Record<string, Cand>;

export const TEMAS: [string, string][] = [
  ["seguranca", "Segurança"],
  ["saude", "Saúde"],
  ["transporte", "Transporte"],
  ["economia", "Economia e emprego"],
  ["educacao", "Educação"],
  ["ambiente_saneamento", "Saneamento e meio ambiente"],
  ["interior", "Interior do estado"],
  ["servidor", "Servidores públicos"],
];

function Lado({ chave, tema, classe }: { chave: string; tema: string; classe: string }) {
  const c = cands[chave];
  const itens = c.temas[tema];
  return (
    <article className={`lado ${classe}`}>
      <header>
        <span className="num">{c.numero}</span>
        <div>
          <h3>{c.nome}</h3>
          <span className="partido">{c.partido}</span>
        </div>
      </header>
      {itens && itens.length > 0 ? (
        itens.map((t) => (
          <div className="proposta" key={t.titulo + t.pagina}>
            <h4>{t.titulo}</h4>
            <blockquote>“{t.trecho}”</blockquote>
            <cite>
              Plano de governo registrado no TSE, p. {t.pagina}
            </cite>
          </div>
        ))
      ) : (
        <p className="vazio">O plano registrado no TSE não trata deste tema com um trecho específico.</p>
      )}
    </article>
  );
}

export default function Duelo() {
  const ref = useEntra<HTMLDivElement>();
  const disponiveis = TEMAS.filter(([k]) => cands.paes.temas[k] || cands.ruas.temas[k]);
  const [tema, setTema] = useState(disponiveis[0]?.[0] ?? "seguranca");
  return (
    <section className="duelo" id="paes-ruas" aria-labelledby="t-duelo">
      <div className="miolo entra" ref={ref}>
        <div className="cabeca-secao">
          <h2 id="t-duelo">Paes × Ruas, proposta por proposta</h2>
          <p>
            Escolha um tema. À esquerda, o que está no plano de governo do Paes. À direita, o que
            está no plano do Douglas Ruas. Os trechos são copiados do que cada um registrou no TSE.
          </p>
        </div>
        <div className="abas" role="tablist" aria-label="Temas">
          {disponiveis.map(([k, nome]) => (
            <button key={k} role="tab" className="aba" aria-selected={tema === k} onClick={() => setTema(k)}>
              {nome}
            </button>
          ))}
        </div>
        <div className="duelo-quadro" role="tabpanel">
          <Lado chave="paes" tema={tema} classe="paes" />
          <Lado chave="ruas" tema={tema} classe="ruas" />
        </div>
        <p className="nota-fonte">
          Planos completos:{" "}
          <a href={cands.paes.fonte_url} target="_blank" rel="noreferrer">Eduardo Paes</a> ·{" "}
          <a href={cands.ruas.fonte_url} target="_blank" rel="noreferrer">Douglas Ruas</a>.
        </p>
      </div>
    </section>
  );
}

import { useState } from "react";
import planos from "../conteudo/planos.json";
import { TEMAS } from "./Duelo";
import { useEntra } from "./useEntra";

type Trecho = { titulo: string; trecho: string; pagina: number };
type Cand = { nome: string; partido: string; numero: string; fonte_url: string; temas: Record<string, Trecho[] | null> };
const cands = planos.candidatos as unknown as Record<string, Cand>;

const ORDEM = ["paes", "ruas", "siri", "marinho", "busnello", "juliete", "cyro", "luan"].filter((k) => cands[k]);

export default function Matriz() {
  const ref = useEntra<HTMLDivElement>();
  const [aberto, setAberto] = useState<{ c: string; t: string; i: number } | null>(null);
  const t = aberto ? cands[aberto.c].temas[aberto.t]?.[aberto.i] : null;
  return (
    <section id="os-outros" aria-labelledby="t-outros">
      <div className="miolo entra" ref={ref}>
        <div className="cabeca-secao">
          <h2 id="t-outros">E os outros candidatos?</h2>
          <p>
            Quem ficou fora do segundo turno também apresentou plano. Veja em quais temas cada um
            tem proposta e clique para ler o trecho.
          </p>
        </div>
        <div className="rolagem">
          <table className="matriz">
            <caption className="somente-leitor">Temas tratados nos planos de governo, por candidato</caption>
            <thead>
              <tr>
                <th scope="col">Tema</th>
                {ORDEM.map((k) => (
                  <th key={k} scope="col" className={k === "paes" ? "paes" : undefined}>
                    {cands[k].nome}
                    <br />
                    <small style={{ fontWeight: 500 }}>{cands[k].partido} {cands[k].numero}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEMAS.map(([chave, nome]) => (
                <tr key={chave}>
                  <th scope="row">{nome}</th>
                  {ORDEM.map((k) => {
                    const itens = cands[k].temas[chave];
                    return (
                      <td key={k} className={k === "paes" ? "paes" : undefined}>
                        {itens && itens.length ? (
                          <button className="celula-btn" onClick={() => setAberto({ c: k, t: chave, i: 0 })}>
                            {itens[0].titulo}
                          </button>
                        ) : (
                          <span className="celula-vazia" aria-label="sem trecho">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {aberto && t && (
          <div className="detalhe-matriz" role="region" aria-live="polite" aria-label="Trecho do plano">
            <header>
              <h3 style={{ fontSize: "var(--t-lg)" }}>{cands[aberto.c].nome}: {t.titulo}</h3>
              <button className="fechar" onClick={() => setAberto(null)}>Fechar</button>
            </header>
            <blockquote>“{t.trecho}”</blockquote>
            <cite>Plano de governo registrado no TSE, p. {t.pagina}</cite>
          </div>
        )}

        <div className="ponte">
          <p>Cada um defende o seu plano. A sua escolha cabe em dois dígitos.</p>
          <span className="grande" aria-hidden="true">55</span>
        </div>
      </div>
    </section>
  );
}

import dados from "../conteudo/fezfaz.json";
import { useEntra } from "./useEntra";

type Fato = { area: string; texto: string; fonte: string; url: string };

function Lista({ itens }: { itens: Fato[] }) {
  return (
    <ul className="fatos">
      {itens.map((f) => (
        <li key={f.texto}>
          <span className="area">{f.area}</span>
          <span className="texto">{f.texto}</span>
          <span className="fonte">
            Fonte: <a href={f.url} target="_blank" rel="noreferrer">{f.fonte}</a>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function FezFaz() {
  const ref = useEntra<HTMLDivElement>();
  return (
    <section id="fez-faz" aria-labelledby="t-fezfaz">
      <div className="miolo entra" ref={ref}>
        <div className="cabeca-secao">
          <h2 id="t-fezfaz">Quem fez, faz</h2>
          <p>
            Paes foi prefeito do Rio em quatro gestões: de 2009 a 2012, de 2013 a 2016, de 2021 a 2024 e o que começou em janeiro de 2025, até se licenciar para disputar o governo. Dá para olhar o que saiu do papel na cidade
            e o que ele promete levar para o resto do estado.
          </p>
        </div>
        <div className="fezfaz">
          <div>
            <h3><span className="rotulo">Já fez</span> pelo Rio</h3>
            <Lista itens={dados.fez} />
          </div>
          <div>
            <h3><span className="rotulo">Vai fazer</span> pelo estado</h3>
            <Lista itens={dados.fara} />
          </div>
        </div>
      </div>
    </section>
  );
}

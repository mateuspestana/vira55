export default function Sobre() {
  return (
    <section id="sobre" aria-labelledby="t-sobre">
      <div className="miolo sobre-grade">
        <h2 id="t-sobre">De onde vem cada coisa</h2>
        <div>
          <p>
            O Vira55 é um site de campanha, feito por um eleitor, para quem quer entender o que está
            em jogo no segundo turno. As propostas dos candidatos são citadas <b>literalmente</b> dos
            planos de governo que eles registraram no TSE, com a página de onde saíram. Não resumimos
            nem trocamos palavras.
          </p>
          <p>
            Os fatos sobre o que o Paes fez como prefeito trazem o link da fonte ao lado. Os números
            do primeiro turno vêm do TSE, e o retrato do eleitorado em cada município sai dos boletins
            de urna de presidente, tratados no projeto Onde dá pra conversar.
          </p>
          <ul className="fontes">
            <li><a href="https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/douglas-ruas-pl-e-eduardo-paes-vao-para-o-2o-turno-no-rio-de-janeiro" target="_blank" rel="noreferrer">TSE: Douglas Ruas e Eduardo Paes vão para o 2º turno</a></li>
            <li><a href="https://divulgacandcontas.tse.jus.br/" target="_blank" rel="noreferrer">DivulgaCandContas (TSE): planos de governo</a></li>
            <li><a href="https://resultados.tse.jus.br/" target="_blank" rel="noreferrer">Resultados do TSE</a></li>
            <li><a href="https://comomeusvizinhosvotam.com.br" target="_blank" rel="noreferrer">comomeusvizinhosvotam.com.br</a></li>
          </ul>
          <p style={{ marginTop: "var(--e6)" }}>Autoria: Matheus C. Pestana.</p>
        </div>
      </div>
    </section>
  );
}

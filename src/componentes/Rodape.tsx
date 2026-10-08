const TEXTO = encodeURIComponent(
  "Dia 25 é segundo turno no Rio. O número do Eduardo Paes é 55: digite 5, 5 e confirme. Veja as propostas lado a lado: https://vira55.vercel.app",
);

export default function Rodape() {
  return (
    <>
      <footer className="rodape">
        <div className="miolo">
          <div className="vinte" aria-hidden="true">55</div>
          <div>
            <p>
              Site independente de apoio à candidatura de Eduardo Paes (PSD 55) ao governo do Rio de Janeiro.
              As propostas são citadas literalmente dos planos de governo registrados no TSE.
            </p>
            <p className="assina">Feito por Matheus C. Pestana.</p>
            <a className="botao amarelo zap" href={`https://wa.me/?text=${TEXTO}`} target="_blank" rel="noreferrer">
              Mandar no WhatsApp
            </a>
          </div>
        </div>
      </footer>
      <a className="barra-fixa" href="#urna" aria-label="Como votar 55">
        Digite <b>55</b> e confirme
      </a>
    </>
  );
}

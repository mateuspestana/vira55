const LINKS = [
  ["#fez-faz", "Fez e faz"],
  ["#paes-ruas", "Paes × Ruas"],
  ["#os-outros", "Os outros"],
  ["#pelo-estado", "Pelo estado"],
  ["#sobre", "Sobre"],
] as const;

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="miolo">
        <a className="marca" href="#topo" aria-label="Vira55, início">
          Vira<span className="selo">55</span>
        </a>
        <nav className="menu-lista" aria-label="Seções">
          {LINKS.map(([href, nome]) => (
            <a key={href} href={href}>{nome}</a>
          ))}
          <a className="destaque" href="#urna">Como votar 55</a>
        </nav>
        <details className="menu-mobile">
          <summary>Menu</summary>
          <div className="gaveta">
            {LINKS.map(([href, nome]) => (
              <a key={href} href={href}>{nome}</a>
            ))}
            <a className="destaque" href="#urna">Como votar 55</a>
          </div>
        </details>
      </div>
    </header>
  );
}

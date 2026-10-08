import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";

type Regiao = {
  bairro: string; local: string; lat: number; lon: number; eleitores: number;
  bn: number; abst: number; lula: number; flavio: number; cod: string;
};
type Dados = { regioes: Regiao[]; municipios: Record<string, string> };
type Metrica = "todos" | "abst" | "bn";

const TILES = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const ATRIBUICAO =
  '&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
  'estilo <a href="https://www.hotosm.org/">Humanitarian OSM Team</a>, ' +
  'servido por <a href="https://openstreetmap.fr/">OSM France</a>';
const ESTADO: L.LatLngBoundsExpression = [[-23.4, -44.9], [-20.75, -40.95]];
const AZUL = "#004282";
const AMARELO = "#fcaf17";

const nf = new Intl.NumberFormat("pt-BR");
const semAcento = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const valorDe = (r: Regiao, m: Metrica) => (m === "abst" ? r.abst : m === "bn" ? r.bn : r.abst + r.bn);

const ROTULOS: Record<Metrica, string> = {
  todos: "Não votaram ou anularam",
  abst: "Não foram votar",
  bn: "Branco e nulo",
};

export default function MapaRJ() {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const camada = useRef<L.LayerGroup | null>(null);
  const enquadrado = useRef(false);
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState(false);
  const [metrica, setMetrica] = useState<Metrica>("todos");
  const [sel, setSel] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [naTela, setNaTela] = useState<number[]>([]);

  useEffect(() => {
    let vivo = true;
    fetch("/dados/regioes.json")
      .then((r) => r.json())
      .then((j: { colunas: string[]; municipios: Record<string, string>; linhas: (string | number)[][] }) => {
        if (!vivo) return;
        const regioes = j.linhas.map((l) => Object.fromEntries(j.colunas.map((c, i) => [c, l[i]])) as unknown as Regiao);
        setDados({ regioes, municipios: j.municipios });
      })
      .catch(() => vivo && setErro(true));
    return () => { vivo = false; };
  }, []);

  const maximo = useMemo(
    () => (dados ? Math.max(...dados.regioes.map((r) => valorDe(r, metrica))) : 1),
    [dados, metrica],
  );

  // Cria o mapa uma vez.
  useEffect(() => {
    if (!caixa.current) return;
    const m = L.map(caixa.current, { preferCanvas: true, zoomControl: true, attributionControl: true });
    m.fitBounds(ESTADO);
    const quadro = requestAnimationFrame(() => { m.invalidateSize(); m.fitBounds(ESTADO, { animate: false }); });
    L.tileLayer(TILES, { subdomains: "abc", maxZoom: 19, attribution: ATRIBUICAO }).addTo(m);
    m.attributionControl.setPrefix(false);
    camada.current = L.layerGroup().addTo(m);
    mapa.current = m;
    const obs = new ResizeObserver(() => m.invalidateSize());
    obs.observe(caixa.current);
    return () => { cancelAnimationFrame(quadro); obs.disconnect(); m.remove(); mapa.current = null; };
  }, []);

  // Desenha as bolhas.
  useEffect(() => {
    const grupo = camada.current;
    if (!grupo || !dados) return;
    grupo.clearLayers();
    if (!enquadrado.current) {
      enquadrado.current = true;
      mapa.current?.invalidateSize();
      mapa.current?.fitBounds(ESTADO, { animate: false });
    }
    const ordem = dados.regioes.map((_, i) => i).sort((a, b) => valorDe(dados.regioes[b], metrica) - valorDe(dados.regioes[a], metrica));
    for (const i of ordem) {
      const r = dados.regioes[i];
      const v = valorDe(r, metrica);
      const escolhida = i === sel;
      const c = L.circleMarker([r.lat, r.lon], {
        radius: 3.5 + Math.sqrt(v / Math.max(maximo, 1)) * 15,
        color: escolhida ? AZUL : "#ffffff",
        weight: escolhida ? 3 : 1.2,
        fillColor: escolhida ? AMARELO : AZUL,
        fillOpacity: escolhida ? 1 : 0.62,
      });
      c.on("click", (e) => { L.DomEvent.stopPropagation(e); setSel(i); });
      c.addTo(grupo);
      if (escolhida) c.bringToFront();
    }
  }, [dados, metrica, sel, maximo]);

  // Lista das maiores regiões na parte visível do mapa.
  useEffect(() => {
    const m = mapa.current;
    if (!m || !dados) return;
    const atualizar = () => {
      const area = m.getBounds();
      const dentro: number[] = [];
      dados.regioes.forEach((r, i) => { if (area.contains([r.lat, r.lon])) dentro.push(i); });
      dentro.sort((a, b) => valorDe(dados.regioes[b], metrica) - valorDe(dados.regioes[a], metrica));
      setNaTela(dentro.slice(0, 8));
    };
    atualizar();
    m.on("moveend", atualizar);
    return () => { m.off("moveend", atualizar); };
  }, [dados, metrica]);

  const irPara = (i: number) => {
    if (!dados) return;
    const r = dados.regioes[i];
    setSel(i);
    mapa.current?.flyTo([r.lat, r.lon], Math.max(mapa.current.getZoom(), 14), { duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8 });
  };

  const irParaMunicipio = (cod: string) => {
    if (!dados) return;
    const pts = dados.regioes.filter((r) => r.cod === cod).map((r) => [r.lat, r.lon] as [number, number]);
    if (pts.length) mapa.current?.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 14 });
    setBusca("");
  };

  const sugestoes = useMemo(() => {
    const q = semAcento(busca.trim());
    if (!dados || q.length < 2) return [];
    return Object.entries(dados.municipios).filter(([, n]) => semAcento(n).includes(q)).slice(0, 6);
  }, [dados, busca]);

  const r = dados && sel !== null ? dados.regioes[sel] : null;

  return (
    <section className="mapa-secao" id="mapa" aria-labelledby="t-mapa">
      <div className="miolo mapa-grade">
        <div className="mapa-moldura">
          <div ref={caixa} className="mapa-caixa" role="application" aria-label="Mapa do estado do Rio de Janeiro com os bairros e locais de votação" />
          {!dados && !erro && <div className="mapa-aviso">Carregando o mapa do estado…</div>}
          {erro && <div className="mapa-aviso">Não deu para carregar os dados do mapa. Tente de novo em instantes.</div>}
        </div>

        <aside className="mapa-painel" aria-label="Controles e detalhes do mapa">
          <div className="mapa-intro">
            <h2 id="t-mapa">Onde tem mais gente para conversar</h2>
            <p>
              Cada bolha é um bairro ou local de votação. Quanto maior, mais eleitores não votaram
              ou anularam o voto no 1º turno.
            </p>
          </div>
          <div className="mapa-bloco">
            <label className="mapa-rotulo" htmlFor="busca-mapa">Ir para um município</label>
            <input id="busca-mapa" type="search" autoComplete="off" placeholder="Ex.: Nova Iguaçu" value={busca} onChange={(e) => setBusca(e.target.value)} />
            {sugestoes.length > 0 && (
              <ul className="sugestoes">
                {sugestoes.map(([cod, nome]) => (
                  <li key={cod}><button onClick={() => irParaMunicipio(cod)}>{nome}</button></li>
                ))}
              </ul>
            )}
            <button className="link-mapa" onClick={() => { mapa.current?.fitBounds(ESTADO); setSel(null); }}>Ver o estado inteiro</button>
          </div>

          <div className="mapa-bloco">
            <span className="mapa-rotulo" id="rot-metrica">Tamanho da bolha</span>
            <div className="chips-mapa" role="group" aria-labelledby="rot-metrica">
              {(Object.keys(ROTULOS) as Metrica[]).map((k) => (
                <button key={k} className="chip-mapa" aria-pressed={metrica === k} onClick={() => setMetrica(k)}>{ROTULOS[k]}</button>
              ))}
            </div>
          </div>

          {r ? (
            <div className="mapa-bloco ficha" aria-live="polite">
              <span className="mapa-rotulo">Região escolhida</span>
              <h3>{r.bairro}</h3>
              <p className="ficha-sub">{dados!.municipios[r.cod]} · {r.local}</p>
              <p className="ficha-grande">{nf.format(r.abst + r.bn)}<small> eleitores não votaram ou anularam</small></p>
              <dl className="ficha-numeros">
                <div><dt>Eleitores</dt><dd>{nf.format(r.eleitores)}</dd></div>
                <div><dt>Não foram votar</dt><dd>{nf.format(r.abst)}</dd></div>
                <div><dt>Branco e nulo</dt><dd>{nf.format(r.bn)}</dd></div>
                <div><dt>Votaram Lula</dt><dd>{nf.format(r.lula)}</dd></div>
                <div><dt>Votaram Flávio</dt><dd>{nf.format(r.flavio)}</dd></div>
              </dl>
              <p className="ficha-nota">Presidente, 1º turno. A conversa acontece na rua, perto do local, nunca dentro dele.</p>
            </div>
          ) : (
            <div className="mapa-bloco">
              <span className="mapa-rotulo">Maiores nesta parte do mapa</span>
              <ol className="top-lista">
                {naTela.map((i) => {
                  const x = dados!.regioes[i];
                  return (
                    <li key={i}>
                      <button onClick={() => irPara(i)}>
                        <span>{x.bairro}<small>{dados!.municipios[x.cod]}</small></span>
                        <b>{nf.format(valorDe(x, metrica))}</b>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="ficha-nota">Toque numa bolha para ver os números.</p>
            </div>
          )}
          {r && <button className="link-mapa" onClick={() => setSel(null)}>Voltar para a lista</button>}
        </aside>
      </div>
    </section>
  );
}

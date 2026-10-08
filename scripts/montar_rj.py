"""Agrega, por município do RJ, o 1º turno de Presidente 2026 (boletins de urna).

Lê o que já foi montado no projeto OndeDaPraConversar (somente leitura) e gera
src/dados/municipios.json. Autor: Matheus C. Pestana.
"""
import glob
import json
import os
from collections import defaultdict

BASE = os.path.expanduser("~/Documents/Datasets/OndeDaPraConversar/public/dados")
RAIZ = os.path.join(os.path.dirname(__file__), "..")
SAIDA = os.path.join(RAIZ, "src", "dados", "municipios.json")
SAIDA_REGIOES = os.path.join(RAIZ, "public", "dados", "regioes.json")

REGIOES = {
    "Capital": ["Rio de Janeiro"],
    "Baixada Fluminense": ["Belford Roxo", "Duque de Caxias", "Guapimirim", "Itaguaí", "Japeri", "Magé", "Mesquita", "Nilópolis", "Nova Iguaçu", "Paracambi", "Queimados", "São João de Meriti", "Seropédica"],
    "Grande Niterói": ["Niterói", "São Gonçalo", "Itaboraí", "Maricá", "Rio Bonito", "Silva Jardim", "Tanguá", "Cachoeiras de Macacu"],
    "Região dos Lagos": ["Araruama", "Armação dos Búzios", "Arraial do Cabo", "Cabo Frio", "Iguaba Grande", "Saquarema", "São Pedro da Aldeia", "Casimiro de Abreu", "Rio das Ostras"],
    "Norte Fluminense": ["Campos dos Goytacazes", "Carapebus", "Cardoso Moreira", "Conceição de Macabu", "Macaé", "Quissamã", "São Fidélis", "São Francisco de Itabapoana", "São João da Barra"],
    "Noroeste Fluminense": ["Aperibé", "Bom Jesus do Itabapoana", "Cambuci", "Italva", "Itaocara", "Itaperuna", "Laje do Muriaé", "Miracema", "Natividade", "Porciúncula", "Santo Antônio de Pádua", "São José de Ubá", "Varre-sai"],
    "Serrana": ["Bom Jardim", "Cantagalo", "Carmo", "Cordeiro", "Duas Barras", "Macuco", "Nova Friburgo", "Petrópolis", "Santa Maria Madalena", "São José do Vale do Rio Preto", "São Sebastião do Alto", "Sumidouro", "Teresópolis", "Trajano de Moraes"],
    "Médio Paraíba": ["Barra do Piraí", "Barra Mansa", "Itatiaia", "Pinheiral", "Piraí", "Porto Real", "Quatis", "Resende", "Rio Claro", "Rio das Flores", "Valença", "Volta Redonda"],
    "Centro-Sul Fluminense": ["Areal", "Sapucaia", "Comendador Levy Gasparian", "Engenheiro Paulo de Frontin", "Mendes", "Miguel Pereira", "Paraíba do Sul", "Paty do Alferes", "Sapucaia", "Três Rios", "Vassouras"],
    "Costa Verde": ["Angra dos Reis", "Mangaratiba", "Paraty"],
}
REG_POR_NOME = {}
for reg, nomes in REGIOES.items():
    for n in nomes:
        REG_POR_NOME.setdefault(n, reg)


def main():
    municipios = {m["c"]: m["n"] for m in json.load(open(f"{BASE}/onde/rj.json"))}
    ac = defaultdict(lambda: defaultdict(int))
    for f in glob.glob(f"{BASE}/secoes/rj-*.json"):
        for chave, s in json.load(open(f)).items():
            cod = chave.split("-")[0]
            a = ac[cod]
            a["aptos"] += s["aptos"]
            a["comparecimento"] += s["comparecimento"]
            a["brancos"] += s["brancos"]
            a["nulos"] += s["nulos"]
            a["lula"] += s["nominais"].get("13", 0)
            a["flavio"] += s["nominais"].get("22", 0)
            a["outros"] += sum(v for k, v in s["nominais"].items() if k not in ("13", "22"))
    saida, sem_regiao = [], []
    for cod, a in ac.items():
        nome = municipios.get(cod, cod)
        reg = REG_POR_NOME.get(nome)
        if not reg:
            sem_regiao.append(nome)
            reg = "Outros"
        saida.append({"c": cod, "n": nome, "r": reg, "aptos": a["aptos"], "abst": a["aptos"] - a["comparecimento"],
                      "brancos": a["brancos"], "nulos": a["nulos"], "lula": a["lula"], "flavio": a["flavio"], "outros": a["outros"]})
    saida.sort(key=lambda x: x["n"])
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    json.dump({"fonte": "Boletins de urna do TSE, 1º turno 2026, Presidente (via OndeDaPraConversar)", "municipios": saida},
              open(SAIDA, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(saida), "municípios; sem região:", sem_regiao)


def regioes():
    """Regiões de votação (bairro/local) do RJ com boletim, para o mapa.
    Linha: bairro, 1º local, lat, lon, eleitores, brancos+nulos, abstenção, lula, flávio, código do município."""
    nomes = {m["c"]: m["n"] for m in json.load(open(f"{BASE}/onde/rj.json"))}
    linhas, vistos = [], set()
    for f in sorted(glob.glob(f"{BASE}/onde/rj-*.json")):
        cod = os.path.basename(f)[3:-5]
        for r in json.load(open(f)):
            _id, bairro, local, nlocais, nsecoes, lat, lon, eleitores, urnas, apuradas, brancos, nulos, abst, lula, flavio, _d = r
            if _id in vistos:
                continue
            vistos.add(_id)
            linhas.append([bairro, local, round(lat, 5), round(lon, 5), eleitores, brancos + nulos, abst, lula, flavio, cod])
    os.makedirs(os.path.dirname(SAIDA_REGIOES), exist_ok=True)
    json.dump({"colunas": ["bairro", "local", "lat", "lon", "eleitores", "bn", "abst", "lula", "flavio", "cod"],
               "municipios": nomes, "linhas": linhas}, open(SAIDA_REGIOES, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(linhas), "regiões de votação")


main()
regioes()

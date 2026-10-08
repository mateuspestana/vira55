"""Resultado do 1º turno de 2026 para GOVERNADOR do RJ (Paes 55 × Ruas 22) por município e por
região de votação (bairro), a partir dos boletins de urna.

Entradas (somente leitura):
  dados/bruto/secoes_2026.csv   votos por seção (estudo13, Omarchy), colunas gov_55, gov_22...
  OndeDaPraConversar/public/dados/{onde,secoes,celulas}  municípios, aptos e regiões com suas seções
Saídas: src/dados/municipios.json e public/dados/regioes.json. Autor: Matheus C. Pestana.
"""
import csv
import glob
import json
import os
from collections import defaultdict

RAIZ = os.path.join(os.path.dirname(__file__), "..")
BASE = os.path.expanduser("~/Documents/Datasets/OndeDaPraConversar/public/dados")
SECOES = os.path.join(RAIZ, "dados", "bruto", "secoes_2026.csv")
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
    "Centro-Sul Fluminense": ["Areal", "Sapucaia", "Comendador Levy Gasparian", "Engenheiro Paulo de Frontin", "Mendes", "Miguel Pereira", "Paraíba do Sul", "Paty do Alferes", "Três Rios", "Vassouras"],
    "Costa Verde": ["Angra dos Reis", "Mangaratiba", "Paraty"],
}
REG_POR_NOME = {n: reg for reg, nomes in REGIOES.items() for n in nomes}


def num(x):
    return int(x or 0)


def main():
    municipios = {m["c"]: m["n"] for m in json.load(open(f"{BASE}/onde/rj.json"))}

    # aptos por seção (do 1º turno de presidente já montado)
    aptos = {}
    for f in glob.glob(f"{BASE}/secoes/rj-*.json"):
        for chave, s in json.load(open(f)).items():
            cod, zona, secao = chave.split("-")
            aptos[(cod, int(zona), int(secao))] = s["aptos"]

    gov = {}
    for r in csv.DictReader(open(SECOES)):
        if r["mun"] in municipios:
            gov[(r["mun"], int(r["zona"]), int(r["secao"]))] = {
                "paes": num(r["gov_55"]), "ruas": num(r["gov_22"]), "total": num(r["gov_total"]),
                "bn": num(r["gov_branco"]) + num(r["gov_nulo"]),
            }

    def somar(chaves):
        t = {"aptos": 0, "paes": 0, "ruas": 0, "total": 0, "bn": 0}
        for k in chaves:
            g = gov.get(k)
            if not g:
                continue
            t["aptos"] += aptos.get(k, 0)
            for c in ("paes", "ruas", "total", "bn"):
                t[c] += g[c]
        t["outros"] = t["total"] - t["paes"] - t["ruas"] - t["bn"]
        t["abst"] = t["aptos"] - t["total"]
        return t

    # municípios
    por_mun = defaultdict(list)
    for k in gov:
        por_mun[k[0]].append(k)
    saida, sem_regiao = [], []
    for cod, chaves in por_mun.items():
        t = somar(chaves)
        nome = municipios[cod]
        reg = REG_POR_NOME.get(nome)
        if not reg:
            sem_regiao.append(nome)
            reg = "Outros"
        saida.append({"c": cod, "n": nome, "r": reg, "aptos": t["aptos"], "paes": t["paes"], "ruas": t["ruas"],
                      "bn": t["bn"], "outros": t["outros"], "abst": t["abst"]})
    saida.sort(key=lambda x: x["n"])
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    json.dump({"fonte": "Boletins de urna do TSE, 1º turno 2026, Governador", "municipios": saida},
              open(SAIDA, "w"), ensure_ascii=False, separators=(",", ":"))
    tot = {c: sum(m[c] for m in saida) for c in ("aptos", "paes", "ruas", "bn", "outros", "abst")}
    print(len(saida), "municípios; sem região:", sem_regiao, tot)

    # regiões de votação (bairro/local)
    linhas = []
    for f in glob.glob(f"{BASE}/celulas/*.json"):
        for r in json.load(open(f)):
            if r["uf"] != "RJ":
                continue
            cod = r["id"].split("-")[1]
            chaves = [(cod, z, s) for loc in r["locais"] for z, s in loc["secoes"]]
            t = somar(chaves)
            if not t["total"]:
                continue
            linhas.append([r["bairro"], r["locais"][0]["nome"] if r["locais"] else "", round(r["lat"], 5), round(r["lon"], 5),
                           t["aptos"], t["paes"], t["ruas"], t["bn"], t["outros"], t["abst"], cod])
    os.makedirs(os.path.dirname(SAIDA_REGIOES), exist_ok=True)
    json.dump({"colunas": ["bairro", "local", "lat", "lon", "eleitores", "paes", "ruas", "bn", "outros", "abst", "cod"],
               "municipios": municipios, "linhas": linhas}, open(SAIDA_REGIOES, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(linhas), "regiões de votação; Paes:", sum(l[5] for l in linhas), "Ruas:", sum(l[6] for l in linhas))


main()

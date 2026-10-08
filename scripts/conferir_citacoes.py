"""Confere se cada trecho citado em src/conteudo/planos.json está na página indicada
do plano de governo (texto extraído dos PDFs do TSE em dados/planos/). Autor: Matheus C. Pestana."""
import json, os, re, sys

RAIZ = os.path.join(os.path.dirname(__file__), "..")
norm = lambda t: re.sub(r"\s+", " ", re.sub(r"(?<=\w)-\s*\n\s*", "", t.replace("​", ""))).strip().lower()
dados = json.load(open(f"{RAIZ}/src/conteudo/planos.json"))
falhas = total = 0
for slug, c in dados["candidatos"].items():
    txt = open(f"{RAIZ}/dados/planos/{slug}.txt", encoding="utf-8").read()
    marcas = sorted((int(m.group(1)), m.end(), m.start()) for m in re.finditer(r"=== P[ÁA]GINA (\d+) ===", txt))
    corpo = {}
    for i, (n, ini, _) in enumerate(marcas):
        fim = marcas[i + 1][2] if i + 1 < len(marcas) else len(txt)
        corpo[n] = norm(txt[ini:fim])
    for tema, itens in c["temas"].items():
        for t in itens or []:
            total += 1
            alvo = norm(t["trecho"])
            ok = any(alvo in corpo.get(p, "") for p in (t["pagina"], t["pagina"] + 1, t["pagina"] - 1)) if t["pagina"] in corpo else False
            exato = alvo in corpo.get(t["pagina"], "")
            if not ok:
                falhas += 1
                print("NÃO ACHEI", slug, tema, t["pagina"], t["trecho"][:70])
            elif not exato:
                print("página vizinha", slug, tema, t["pagina"])
print(f"{total - falhas}/{total} trechos conferidos")
sys.exit(1 if falhas else 0)

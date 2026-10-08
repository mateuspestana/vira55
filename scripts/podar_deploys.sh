#!/bin/bash
# Espera o deploy do último push terminar e deixa só os 2 deploys mais novos
# (o atual e o anterior), para não pesar no armazenamento da Vercel.
# Uso: depois de cada push, rode `npm run podar`. Autor: Matheus C. Pestana.
set -uo pipefail
cd "$(dirname "$0")/.."
PROJETO=vira55
ESCOPO=macape
MANTER=2
SHA=$(git rev-parse HEAD)

listar() {
  # a CLI às vezes devolve vazio; tenta de novo até vir um JSON válido
  for _ in 1 2 3 4 5; do
    saida=$(vercel ls "$PROJETO" --scope "$ESCOPO" --format json --limit 100 2>/dev/null </dev/null)
    if echo "$saida" | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then echo "$saida"; return; fi
    sleep 3
  done
  echo '{"deployments": []}'
}

for _ in $(seq 1 60); do
  ESTADO=$(listar | python3 -c "
import json, sys
d = json.load(sys.stdin)['deployments']
m = [x for x in d if x.get('meta', {}).get('githubCommitSha') == '$SHA']
print(m[0]['state'] if m else 'ESPERANDO')")
  case "$ESTADO" in
    READY) echo "=== deploy pronto ($SHA)"; break ;;
    ERROR|CANCELED) echo "=== deploy falhou: $ESTADO ($SHA)"; break ;;
    *) sleep 10 ;;
  esac
done

listar | python3 -c "
import json, sys
d = sorted(json.load(sys.stdin)['deployments'], key=lambda x: x['createdAt'], reverse=True)
for x in d[$MANTER:]:
    print(x['url'])" | while read -r url; do
  vercel rm "$url" --scope "$ESCOPO" --yes --safe > /dev/null 2>&1 && echo "=== removido $url"
done

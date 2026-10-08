# Vira55

Site de apoio à candidatura de Eduardo Paes (PSD 55) ao governo do Rio de Janeiro, segundo turno de 25/10/2026.

- Propostas dos candidatos: citações literais dos planos de governo registrados no TSE (`src/conteudo/planos.json`), conferidas com `npm run conferir`.
- Retrato do eleitorado por município: boletins de urna do 1º turno (Presidente), via projeto Onde dá pra conversar (`npm run dados`).
- O mapa abre na cidade do visitante pelo IP (`api/onde.ts`, cabeçalhos de geolocalização da Vercel; sem guardar nada). Para testar localmente: `/?cidade=Niterói`.
- Datas e avisos do calendário: `src/calendario.ts`.

```
npm install
npm run dev      # http://localhost:5180
npm run build
```

Autoria: Matheus C. Pestana.

Deploys: a Vercel guarda só os 2 mais recentes (o atual e o anterior). Depois de cada push, rode `npm run podar`.

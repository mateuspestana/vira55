// Datas e avisos do calendário. Mexa só aqui se o TSE mudar o quadro.
export const SEGUNDO_TURNO = new Date("2026-10-25T08:00:00-03:00"); // abertura das urnas
export const DATA_EXTENSO = "25 de outubro";

// Se o TSE alterar o quadro do 1º turno, escreva o aviso aqui (ou deixe null).
export const AVISO: string | null = null;

export function diasAte(agora: Date = new Date()): number {
  const ms = SEGUNDO_TURNO.getTime() - agora.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

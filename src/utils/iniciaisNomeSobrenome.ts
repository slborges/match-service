/**
 * Iniciais para avatares: primeira letra do primeiro nome + primeira do último sobrenome.
 * Um só nome → uma letra. Nome vazio → `fallback` (default "?").
 */
export function iniciaisNomeSobrenome(name: string, fallback = "?"): string {
  const partes = name.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return fallback;
  if (partes.length === 1) {
    const c = partes[0].charAt(0);
    return c ? c.toUpperCase() : fallback;
  }
  const a = partes[0].charAt(0);
  const b = partes[partes.length - 1].charAt(0);
  if (!a && !b) return fallback;
  return `${a ? a.toUpperCase() : ""}${b ? b.toUpperCase() : ""}` || fallback;
}

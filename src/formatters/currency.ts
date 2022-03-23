export function parseToBRL(value: any): string {
  if (!value) return value;

  return `R$${value.replace('.', ',')}`;
}

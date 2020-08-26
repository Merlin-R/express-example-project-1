export function splitComma(value?: string): undefined | string[] {
  if (!value) return undefined;
  return value.split(",");
}

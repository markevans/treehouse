export const emptyStringToNull = {
  filter: (a: string): string | null => a === '' ? null : a,
  unfilter: (a: string | null): string => a === null ? '' : a
}

export class Page<T = unknown> {
  public constructor(public data: T[], public total: number, public top: number, public skip: number) {}
}

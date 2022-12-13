export class Reference {
  constructor(
    readonly book: string,
    readonly chapter: number | null = null,
    readonly verse: number | null = null
  ) {}

  toString() {
    if (!this.chapter) {
      return this.book;
    }

    if (!this.verse) {
      return `${this.book} ${this.chapter}`;
    }

    return `${this.book} ${this.chapter}:${this.verse}`;
  }
}

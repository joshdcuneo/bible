import { Parser } from "./Parser";
import { ReferenceBuilder } from "./ReferenceBuilder";

export class Reference {
  constructor(
    readonly book: string,
    readonly chapter: number | null = null,
    readonly verse: number | null = null
  ) {}

  static parse(input: string): Reference
  {
    const { value } = Parser.reference.parse(input);


    if (value === undefined) {
      throw new Error(`Could not parse passage: ${input}`);
    }

    return ReferenceBuilder.fromReference(value).complete();
  }

  toString() {
    if (!this.chapter) {
      return this.book;
    }

    if (!this.verse) {
      return `${this.book} ${this.chapter}`;
    }

    return `${this.book} ${this.chapter}:${this.verse}`;
  }

  toValue() {
    return {
      book: this.book,
      chapter: this.chapter,
      verse: this.verse,
    };
  }
}

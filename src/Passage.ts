import { Parser } from "./Parser";
import { PassageBuilder } from "./PassageBuilder";
import type { Reference } from "./Reference";

export class Passage {
  constructor(readonly from: Reference, readonly to: Reference) {}

  static parse(input: string): Passage {
    const { value } = Parser.passage.parse(input);

    if (value === undefined) {
      throw new Error(`Could not parse passage: ${input}`);
    }

    return PassageBuilder.fromPassage(value).complete();
  }

  toString() {
    if (this.isSameVerse()) {
      return this.from.toString();
    }

    if (this.isSameChapter()) {
      return `${this.from.toString()}-${this.to.verse}`;
    }

    if (this.isSameBook()) {
      return `${this.from.toString()}-${this.to.chapter}:${this.to.verse}`;
    }

    return `${this.from.toString()}-${this.to.toString()}`;
  }

  toValue() {
    return {
      from: this.from.toValue(),
      to: this.to.toValue(),
    };
  }

  private isSameBook() {
    return this.from.book === this.to.book;
  }

  private isSameChapter() {
    return this.isSameBook() && this.from.chapter === this.to.chapter;
  }

  private isSameVerse() {
    return this.isSameChapter() && this.from.verse === this.to.verse;
  }
}

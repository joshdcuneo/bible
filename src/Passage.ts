import { isFailure, Parser } from "./Parser";
import { PassageBuilder } from "./PassageBuilder";
import type { Reference, ReferenceValue } from "./Reference";

/**
 * PassageValue represents the properties of a passage as a plain object.
 */
export interface PassageValue {
  /**
   * The first verse in the passage.
   */
  from: ReferenceValue;
  /**
   * The last verse in the passage.
   */
  to: ReferenceValue;
}

/**
 * A passage is a range of verses.
 */
export class Passage implements PassageValue {
  /**
   * Create a new passage without validation.
   */
  constructor(
    /**
     * The first verse in the passage.
     */
    readonly from: Reference, 
    /**
     * The last verse in the passage.
     */
    readonly to: Reference
    ) {}

  /**
   * Parse a passage from a string.
   * @throws {Error} If the input cannot be parsed.
   */
  static parse(input: string): Passage {
    const result = Parser.passage.parse(input);

    if (isFailure(result)) {
      throw new Error(`Could not parse passage: ${input}`);
    }

    return PassageBuilder.fromValue(result.value).complete();
  }

  /**
   * Extract the first passage from a string.
   * @param {string} input A string to attempt to extract a passage from.
   * @returns {Passage | null} The first passage if one can be extracted, otherwise null.
   */
  static extract(input: string): Passage | null {
    const result = Parser.extractPassage.parse(input);
    if (isFailure(result)) {
      return null;
    }

    return PassageBuilder.fromValue(result.value).complete();
  }

  /**
   * Extract the passages from a string.
   * @param {string} input A string to attempt to extract a passages from.
   * @returns {ReadonlyArray<Passage>} The passages if any can be extracted, otherwise an empty array.
   */
  static extractAll(input: string): ReadonlyArray<Passage> {
    const result = Parser.extractAllPassages.parse(input);
    if (isFailure(result)) {
      return [];
    }

    return result.value.map(value => PassageBuilder.fromValue(value).complete());
  }

  /**
   * Convert the passage to a string.
   */
  toString(): string {
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

  /**
   * The underlying value of the passage as a plain object.
   */
  toValue(): PassageValue {
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

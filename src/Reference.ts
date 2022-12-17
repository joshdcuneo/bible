import { isFailure, Parser } from "./Parser";
import { ReferenceBuilder } from "./ReferenceBuilder";

/**
 * ReferenceValue represents the properties of a reference as a plain object.
 */
export interface ReferenceValue {
  /**
   * The book of the Bible.
   */
  book: string;
  /**
   * The chapter of the book if there is one referenced
   */
  chapter: number | null;
  /**
   * The verse of the chapter if there is one referenced
   */
  verse: number | null;
}

/**
 * A reference to a verse in the Bible.
 */
export class Reference implements ReferenceValue {
   /**
   * Create a new reference without validation.
   */
  constructor(
    /**
     * The book of the Bible.
     */
    readonly book: string,
    /**
     * The chapter of the book if there is one referenced
     */
    readonly chapter: number | null = null,
    /**
     * The verse of the chapter if there is one referenced
     */
    readonly verse: number | null = null
  ) {}

  /**
   * Parse a reference from a string.
   * @throws {Error} If the input cannot be parsed.
   */
  static parse(input: string): Reference {
    const result = Parser.reference.parse(input);

    if (isFailure(result)) {
      throw new Error(`Could not parse passage: ${input}`);
    }

    return ReferenceBuilder.fromValue(result.value).complete();
  }

  /**
   * Convert the reference to a string.
   */
  toString(): string {
    if (!this.chapter) {
      return this.book;
    }

    if (!this.verse) {
      return `${this.book} ${this.chapter}`;
    }

    return `${this.book} ${this.chapter}:${this.verse}`;
  }

  /**
   * The underlying value of the reference as a plain object.
   */
  toValue(): ReferenceValue {
    return {
      book: this.book,
      chapter: this.chapter,
      verse: this.verse,
    };
  }
}

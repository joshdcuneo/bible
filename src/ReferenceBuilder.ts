import { bible } from "./Bible";
import { Reference } from "./Reference";
import { ReferenceError } from "./ReferenceError";

export class ReferenceBuilder {
  constructor(
    readonly book: string | null = null,
    readonly chapter: number | null = null,
    readonly verse: number | null = null
  ) {}

  static fromReference(reference: Reference): ReferenceBuilder {
    return new ReferenceBuilder(
      reference.book,
      reference.chapter ? Number(reference.chapter) : reference.chapter,
      reference.verse ? Number(reference.verse) : reference.verse
    );
  }

  setBook(book: string) {
    return new ReferenceBuilder(book, this.chapter, this.verse);
  }

  setChapter(chapter: number) {
    return new ReferenceBuilder(this.book, Number(chapter), this.verse);
  }

  setVerse(verse: number) {
    return new ReferenceBuilder(this.book, this.chapter, Number(this.chapter));
  }

  isValid(): this is Reference {
    if (!this.chapter) {
      return bible.isBook(this.book ?? "");
    }

    if (!this.verse) {
      return bible.isChapterIn(this.book ?? "", this.chapter ?? 0);
    }

    return bible.isVerseIn(this.book ?? "", this.chapter ?? 0, this.verse ?? 0);
  }

  complete() {
    if (!this.isValid()) {
      throw ReferenceError.invalidReference()
    }

    return new Reference(this.book, this.chapter, this.verse);
  }
}

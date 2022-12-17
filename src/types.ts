import type  P from "parsimmon";
import type { Passage } from "./Passage";
import type { Reference, ReferenceValue } from "./Reference";


export interface LanguageSpec {
  passage: Passage;
  extractPassage: Passage;
  extractAllPassages: ReadonlyArray<Passage>;
  from: ReferenceValue | Partial<ReferenceValue>;
  to: string | Pick<ReferenceValue, "chapter" | "verse"> | null;
  book: string;
  chapter: number;
  verse: number;
  reference: ReferenceValue | Partial<ReferenceValue>;
  fullReference: ReferenceValue;
  bookReference: Partial<ReferenceValue>;
  bookChapterReference: Partial<ReferenceValue>;
  bookChapterVerseReference: Partial<ReferenceValue>;
  partialChapterOrVerseReference: number;
  partialChapterAndVerseReference: Pick<ReferenceValue, "chapter" | "verse">;
  colon: string;
  dash: string;
  optionalBook: string | null;
  optionalChapter: number | null;
  optionalVerse: number | null;
  optionalColon: string | null;
  optionalDash: string | null;
  _: string;
}

export type NamedParser<T extends keyof LanguageSpec> = [
  T,
  P.Parser<LanguageSpec[T]>
];

export type PassageParseResult =
  | Passage
  | { from: Reference; to: Reference | Partial<Reference> | null };

import P from "parsimmon";
import {bible} from './Bible'
import { Passage } from "./Passage";
import { Reference } from "./Reference";

const books = Object.keys(bible.books);

interface LanguageSpec {
  passage: Passage
  reference: Reference | Partial<Reference>
  fullReference: Reference
  bookReference: Partial<Reference>
  bookChapterReference: Partial<Reference>
  bookChapterVerseReference: Partial<Reference>
  partialReference: string  | Pick<Reference, 'chapter' | 'verse'>
  partialChapterOrVerseReference: string;
  partialChapterAndVerseReference: Pick<Reference, 'chapter' | 'verse'>
  book: string
  chapter: string
  verse: string
  colon: string
  dash: string
  optionalBook: string|null
  optionalChapter: string|null
  optionalVerse: string|null
  optionalColon: string|null
  optionalDash: string|null
  _: string
}

type PartialReferenceResult = Reference | Partial<Reference> | null

export const Parser = P.createLanguage<LanguageSpec>({
  passage(r) {
    const parsers: Array<['from' |'to', P.Parser<Reference | PartialReferenceResult>] | P.Parser<unknown>> = [
      ["from", r.reference],
      r._,
      r.optionalDash,
      ["to", r.partialReference.or(P.succeed(null))],
    ];
    return P.seqObj<Passage | {from:Reference, to: PartialReferenceResult}, 'from' | 'to'>(...parsers).map<Passage>(({to, from}) => {
      if(to === null) {
        return new Passage(from, from)
      }

      if (typeof to === 'string') {
        if(from.verse) {
          return new Passage(from, new Reference(from.book, from.chapter, parseInt(to, 10)))
        }

        return new Passage(from, new Reference(from.book, parseInt(to, 10)))
      }

      if(to.book === undefined) {
        return new Passage(from, new Reference(from.book, to.chapter, to.verse))
      }

      return new Passage(from, new Reference(to.book, to.chapter, to.verse))
    });
  },
  reference(r) {
    return P.alt(
      r.fullReference,
      r.bookChapterVerseReference,
      r.bookChapterReference,
      r.bookReference
    );
  },
  fullReference(r) {
    const parsers = [
      ["book", r.book],
      r._,
      ["chapter", r.chapter],
      r._,
      r.optionalColon,
      r._,
      ["verse", r.verse],
    ];
    return P.seqObj(...parsers);
  },
  bookReference(r) {
    return P.seqObj(["book", r.book]);
  },
  bookChapterReference(r) {
    const parsers = [["book", r.book], r._, ["chapter", r.chapter]];
    return P.seqObj(...parsers);
  },
  bookChapterVerseReference(r) {
    const parsers = [
      ["book", r.book],
      r._,
      ["chapter", r.chapter],
      r._,
      r.colon,
      r._,
      ["verse", r.verse],
    ];
    return P.seqObj(...parsers);
  },
  partialReference(r) {
    return P.alt(
      r.partialChapterAndVerseReference,
      r.partialChapterOrVerseReference
    );
  },
  partialChapterOrVerseReference(r) {
    return r.chapter.or(r.verse);
  },
  partialChapterAndVerseReference(r) {
    const parsers = [
      ["chapter", r.chapter],
      r._,
      r.colon,
      r._,
      ["verse", r.verse],
    ];
    return P.seqObj(...parsers);
  },
  book() {
    return P.alt(...books.map((book) => P.string(book)));
  },
  chapter() {
    return P.regexp(/[0-9]+/);
  },
  verse() {
    return P.regexp(/[0-9]+/);
  },
  colon() {
    return P.string(":");
  },
  dash() {
    return P.string("-");
  },
  optionalBook(r) {
    return r.book.or(P.succeed(null));
  },
  optionalChapter(r) {
    return r.chapter.or(P.succeed(null));
  },
  optionalVerse(r) {
    return r.verse.or(P.succeed(null));
  },
  optionalColon(r) {
    return r.colon.or(P.succeed(null));
  },
  optionalDash(r) {
    return r.dash.or(P.succeed(null));
  },
  _: function () {
    return P.optWhitespace;
  },
});

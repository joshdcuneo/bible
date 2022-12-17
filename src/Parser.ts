import P from "parsimmon";
import { bible } from "./Bible";
import { Passage } from "./Passage";
import { Reference } from "./Reference";
import type { LanguageSpec, NamedParser, PassageParseResult } from "./types";

const books = Object.keys(bible.books);

export function isSuccessful<T>(result: P.Result<T>): result is P.Success<T> {
  return result.status;
}

export function isFailure<T>(result: P.Result<T>): result is P.Failure {
  return !isSuccessful(result);
}

function namedParser<T extends keyof LanguageSpec>(
  language: P.TypedLanguage<LanguageSpec>,
  name: T,
  extendParser: (
    parser: P.Parser<LanguageSpec[T]>
  ) => P.Parser<LanguageSpec[T]> = (p) => p
): NamedParser<T> {
  return [name, extendParser(language[name])];
}

function transformResultToPassage({ from, to }: PassageParseResult): Passage {
  if (to === null) {
    return new Passage(from, from);
  }

  if (typeof to === "number") {
    if (from.verse) {
      return new Passage(
        from,
        new Reference(from.book, from.chapter, parseInt(to, 10))
      );
    }

    return new Passage(from, new Reference(from.book, parseInt(to, 10)));
  }

  if (to.book === undefined) {
    return new Passage(from, new Reference(from.book, to.chapter, to.verse));
  }

  return new Passage(from, new Reference(to.book, to.chapter, to.verse));
}

export const Parser = P.createLanguage<LanguageSpec>({
  passage(r) {
    return P.seqObj<PassageParseResult, "from" | "to">(
      namedParser(r, "from"),
      r._,
      r.optionalDash,
      namedParser(r, "to", (p) => p.or(P.succeed(null)))
    ).map<Passage>(transformResultToPassage);
  },
  extractPassage(r) {
    return r.passage.skip(P.all).or(P.any.then(r.extractPassage))
  },
  extractAllPassages(r) {
    return r.passage.or(P.any.then(r.extractPassage)).many()
  },
  from(r) {
   return r.reference
  },
  to(r) {
    return P.alt(
      r.partialChapterAndVerseReference,
      r.partialChapterOrVerseReference
    );
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
    return P.seqObj(
      namedParser(r, "book"),
      r._,
      namedParser(r, "chapter"),
      r._,
      r.optionalColon,
      r._,
      namedParser(r, "verse")
    );
  },
  bookReference(r) {
    return P.seqObj(namedParser(r, "book"));
  },
  bookChapterReference(r) {
    return P.seqObj(namedParser(r, "book"), r._, namedParser(r, "chapter"));
  },
  bookChapterVerseReference(r) {
    return P.seqObj(
      namedParser(r, "book"),
      r._,
      namedParser(r, "chapter"),
      r._,
      r.colon,
      r._,
      namedParser(r, "verse")
    );
  },
  partialChapterOrVerseReference(r) {
    return r.chapter.or(r.verse);
  },
  partialChapterAndVerseReference(r) {
    return P.seqObj(
      namedParser(r, "chapter"),
      r._,
      r.colon,
      r._,
      namedParser(r, "verse")
    );
  },
  book() {
    return P.alt(...books.map((book) => P.string(book)));
  },
  chapter() {
    return P.regexp(/[0-9]+/).map(Number);
  },
  verse() {
    return P.regexp(/[0-9]+/).map(Number);
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

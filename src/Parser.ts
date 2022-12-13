import P from "parsimmon";
import {bible} from './Bible'

const books = Object.keys(bible.books);

export const Parser = P.createLanguage({
  Passage(r) {
    const parsers = [
      ["from", r.Reference],
      r._,
      r.OptDash,
      ["to", r.PartialReference.or(P.succeed(null))],
    ];
    return P.seqObj(...parsers).map((result) => {
      if(result.to === null) {
        return {
          ...result,
          to: result.from
        }
      }

      if (typeof result.to === 'string') {
        if(result.from.verse) {
          return {
            ...result,
            to: {
              ...result.from,
              verse: result.to
            }
          }
        }

        return {
          ...result,
          to: {
            ...result.from,
            chapter: result.to
          }
        }
      }

      if(result.to.book === undefined) {
        return {
          ...result,
          to: {
            ...result.from,
            ...result.to
          }
        }
      }

      return result
    });
  },
  Reference(r) {
    return P.alt(
      r.FullReference,
      r.BookChapterVerseReference,
      r.BookChapterReference,
      r.BookReference
    );
  },
  FullReference(r) {
    const parsers = [
      ["book", r.Book],
      r._,
      ["chapter", r.Chapter],
      r._,
      r.OptColon,
      r._,
      ["verse", r.Verse],
    ];
    return P.seqObj(...parsers);
  },
  BookReference(r) {
    return P.seqObj(["book", r.Book]);
  },
  BookChapterReference(r) {
    const parsers = [["book", r.Book], r._, ["chapter", r.Chapter]];
    return P.seqObj(...parsers);
  },
  BookChapterVerseReference(r) {
    const parsers = [
      ["book", r.Book],
      r._,
      ["chapter", r.Chapter],
      r._,
      r.Colon,
      r._,
      ["verse", r.Verse],
    ];
    return P.seqObj(...parsers);
  },
  PartialReference(r) {
    return P.alt(
      r.PartialChapterAndVerseReference,
      r.PartialChapterOrVerseReference
    );
  },
  PartialChapterOrVerseReference(r) {
    return r.Chapter.or(r.Verse);
  },
  PartialChapterAndVerseReference(r) {
    const parsers = [
      ["chapter", r.Chapter],
      r._,
      r.Colon,
      r._,
      ["verse", r.Verse],
    ];
    return P.seqObj(...parsers);
  },
  Book() {
    return P.alt(...books.map((book) => P.string(book)));
  },
  Chapter() {
    return P.regexp(/[0-9]+/);
  },
  Verse() {
    return P.regexp(/[0-9]+/);
  },
  Colon() {
    return P.string(":");
  },
  Dash() {
    return P.string("-");
  },
  OptBook(r) {
    return r.Book.or(P.succeed(""));
  },
  OptChapter(r) {
    return r.Chapter.or(P.succeed(""));
  },
  OptVerse(r) {
    return r.Verse.or(P.succeed(""));
  },
  OptColon(r) {
    return r.Colon.or(P.succeed(""));
  },
  OptDash(r) {
    return r.Dash.or(P.succeed(""));
  },
  _: function () {
    return P.optWhitespace;
  },
});

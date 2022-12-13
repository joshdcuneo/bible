import data from '../bible.json';

class Bible {
  constructor(readonly books: Record<string, Record<string, string>>) {}

  isBook(book: string): boolean {
    return Object.keys(this.books).includes(book);
  }

  isChapterIn(book: string, chapter: number): boolean {
    return Object.keys(this.books[book] ?? {}).includes(chapter.toString());
  }

  isVerseIn(book: string, chapter: number, verse: number): boolean {
    const versesInChapter = Number(this.books[book]?.[chapter.toString()] ?? 0);
    return verse <= versesInChapter;
  }
}

export const bible = new Bible(data)
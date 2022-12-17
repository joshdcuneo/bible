import { Passage } from "./Passage";
import { it, expect, describe } from "vitest";
import { Reference } from "./Reference";

describe("Parse", () => {
  it("parses a book reference", () => {
    const result = Passage.parse("Genesis");
    expect(result).toEqual(
      new Passage(new Reference("Genesis"), new Reference("Genesis"))
    );
  });
  it("parses a numbered book reference", () => {
    const result = Passage.parse("1 John");
    expect(result).toEqual(
      new Passage(new Reference("1 John"), new Reference("1 John"))
    );
  });
  it("parses a book and chapter reference", () => {
    const result = Passage.parse("Genesis 23");
    expect(result).toEqual(
      new Passage(new Reference("Genesis", 23), new Reference("Genesis", 23))
    );
  });
  it("parses a numbered book and chapter reference", () => {
    const result = Passage.parse("1 John 1");
    expect(result).toEqual(
      new Passage(new Reference("1 John", 1), new Reference("1 John", 1))
    );
  });
  it("parses a book, chapter and verse reference", () => {
    const result = Passage.parse("Genesis 1:12");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 12),
        new Reference("Genesis", 1, 12)
      )
    );
  });
  it("parses a numbered book, chapter and verse reference", () => {
    const result = Passage.parse("1 John 1:3");
    expect(result).toEqual(
      new Passage(new Reference("1 John", 1, 3), new Reference("1 John", 1, 3))
    );
  });

  it("parses a passage ranging between chapters", () => {
    const result = Passage.parse("Genesis 1-3");
    expect(result).toEqual(
      new Passage(new Reference("Genesis", 1), new Reference("Genesis", 3))
    );
  });

  it("parses a passage ranging between verses in the same chapter", () => {
    const result = Passage.parse("Genesis 1:12-16");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 12),
        new Reference("Genesis", 1, 16)
      )
    );
  });
  it("parses a passage ranging between verses in different chapters", () => {
    const result = Passage.parse("Genesis 1:12-2:16");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 12),
        new Reference("Genesis", 2, 16)
      )
    );
  });

  it("parses a passage ranging between a chapter and a verse in another chapter", () => {
    const result = Passage.parse("Genesis 1-3:2");
    expect(result).toEqual(
      new Passage(new Reference("Genesis", 1), new Reference("Genesis", 3, 2))
    );
  });

  it("it throws when passage cannot be parsed", () => {
    expect(() => {
      Passage.parse("Not a passage");
    }).toThrow(new Error("Could not parse passage: Not a passage"));
  });

  it("it throws when passage is invalid", () => {
    expect(() => {
      Passage.parse("Genesis 100");
    }).toThrow(new Error("Invalid passage"));
  });
});

describe("extract", () => {
  it("extracts a passage from a string that is just a passage", () => {
    const result = Passage.extract("Genesis 1:1-2:3");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 1),
        new Reference("Genesis", 2, 3)
      )
    );
  });

  it("extracts a passage from a string with leading text", () => {
    const result = Passage.extract("Today's reading is Genesis 1:1-2:3");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 1),
        new Reference("Genesis", 2, 3)
      )
    );
  });

  it("extracts a passage from a string with trailing text", () => {
    const result = Passage.extract("Genesis 1:1-2:3 is the reading today");
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 1),
        new Reference("Genesis", 2, 3)
      )
    );
  });

  it("extracts a passage from a string with leading and trailing text", () => {
    const result = Passage.extract(
      "Today's reading is Genesis 1:1-2:3 so please open your bible"
    );
    expect(result).toEqual(
      new Passage(
        new Reference("Genesis", 1, 1),
        new Reference("Genesis", 2, 3)
      )
    );
  });
});

describe("extractAll", () => {
  it("extracts many passages", () => {
    const result = Passage.extractAll("Genesis 1:1-2:3 and Genesis 3:4-5:6");
    expect(result).toEqual([
      new Passage(
        new Reference("Genesis", 1, 1),
        new Reference("Genesis", 2, 3)
      ),
      new Passage(
        new Reference("Genesis", 3, 4),
        new Reference("Genesis", 5,6)
      ),
    ]);
  });
});

# Bible

This packages contains Passage and Reference types which can be used to work with references to passages of the Bible.

## Reference

A reference refers to a book, a chapter in a book or a verse in a chapter in a book.

### Construct a reference

If you have trusted inputs which you know to be valid you can construct a reference directly:

```ts
new Reference('John', 3, 16)
```

### Parse a reference

Alternatively if you have untrusted input you can parse a string, this will throw if the reference is invalid:

```ts
// parses valid references
assert(Reference.parse('John 3:16') instanceof Reference)

//throws on invalid references
try {
  Reference.parse('Not a reference')
} catch (error) {
  assert(error instanceof Error)
}
```

## Passage

A passage spans from and to a reference. These references may be the same if a passage is only one verse.

### Construct a passage

If you have trusted inputs which you know to be valid you can construct a passage directly:

```ts
new Passage(
  new Reference('Matthew', 5, 1),
  new Reference('Matthew', 5, 12)
)
```

### Parse a passage

Alternatively if you have untrusted input you can parse a string, this will throw if the reference is invalid:

```ts
// parses valid passages
assert(Passage.parse('Matthew 5:1-12') instanceof Reference)

//throws on invalid passages
try {
  Passage.parse('Not a passage')
} catch (error) {
  assert(error instanceof Error)
}
```

### Extract a passage

You can also extract a passage from a string containing other text, this will return null if no passages are found.

```ts
assert(Passage.extract('The reading is Matthew 5:1-12') instanceof Passage)
assert(Passage.extract('No passages to be found here') === null)
```

### Extract multiple passages

You can also extract multiple passages from a string.

```ts
const textWithTwoPassages = 'The readings today are Matthew 5:1-12 and John 3:16'
assert(Passage.extractAll(textWithTwoPassages).length === 2)
assert(Passage.extractAll('No passages to be found here').length === 0)
```



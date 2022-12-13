export class PassageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PassageError";
  }

  static invalidPassage() {
    return new PassageError("Invalid passage");
  }
}

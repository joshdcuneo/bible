export class ReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReferenceError";
  }

  static invalidReference() {
    return new ReferenceError("Invalid reference");
  }
}

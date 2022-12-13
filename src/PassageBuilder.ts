import { Passage } from "./Passage";
import { ReferenceBuilder } from "./ReferenceBuilder";
import { Reference } from "./Reference";
import { PassageError } from "./PassageError";
import { ReferenceError } from "./ReferenceError";

export class PassageBuilder {
  constructor(
    readonly from: Reference | null = null,
    readonly to: Reference | null = null
  ) {}

  static fromPassage(passage: Passage) {
    try {
      return new PassageBuilder().setFrom(passage.from).setTo(passage.to);
    } catch (error) {
      throw PassageError.invalidPassage();
    }
  }

  setFrom(from: Reference): PassageBuilder {
    return new PassageBuilder(this.buildReference(from), this.to);
  }

  setTo(to: Reference): PassageBuilder {
    return new PassageBuilder(this.from, this.buildReference(to));
  }

  isValid(): this is Passage {
    return Boolean(this.from && this.to);
  }

  complete(): Passage {
    if (!this.isValid()) {
      throw PassageError.invalidPassage();
    }

    return new Passage(this.from, this.to);
  }

  private buildReference(reference: Reference): Reference {
    const builder = ReferenceBuilder.fromReference(reference);

    if (!builder.isValid()) {
      throw ReferenceError.invalidReference();
    }

    return builder.complete();
  }
}

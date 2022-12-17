import { Passage, PassageValue } from "./Passage";
import { ReferenceBuilder } from "./ReferenceBuilder";
import type { Reference, ReferenceValue } from "./Reference";
import { PassageError } from "./PassageError";
import { ReferenceError } from "./ReferenceError";

export class PassageBuilder {
  constructor(
    readonly from: ReferenceValue | null = null,
    readonly to: ReferenceValue | null = null
  ) {}

  static fromValue(passage: PassageValue) {
    try {
      return new PassageBuilder().setFrom(passage.from).setTo(passage.to);
    } catch (error) {
      throw PassageError.invalidPassage();
    }
  }

  setFrom(from: ReferenceValue): PassageBuilder {
    return new PassageBuilder(this.buildReference(from), this.to);
  }

  setTo(to: ReferenceValue): PassageBuilder {
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

  private buildReference(reference: ReferenceValue): Reference {
    const builder = ReferenceBuilder.fromValue(reference);

    if (!builder.isValid()) {
      throw ReferenceError.invalidReference();
    }

    return builder.complete();
  }
}

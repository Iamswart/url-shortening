export class JWTUser {
  readonly id: string;

  constructor(details: any) {
    this.id = details.id;
  }

  getId(): string {
    return this.id;
  }

}

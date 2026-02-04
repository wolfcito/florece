// Entidad de ejemplo siguiendo Clean Architecture y SOLID
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string
  ) {}
}

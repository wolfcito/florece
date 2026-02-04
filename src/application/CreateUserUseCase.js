// Caso de uso de ejemplo siguiendo Clean Architecture y SOLID
import { User } from '../domain/User';

export class CreateUserUseCase {
  execute(name, email) {
    // Aquí iría la lógica de negocio
    return new User(Date.now().toString(), name, email);
  }
}

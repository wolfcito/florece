// Servicio de infraestructura de ejemplo siguiendo Clean Architecture y SOLID
export class UserRepository {
  save(user) {
    // Aquí se implementaría la persistencia (ejemplo: localStorage, API, etc.)
    console.log('Usuario guardado:', user);
  }
}

// Adaptador de ejemplo siguiendo Clean Architecture y SOLID
import { CreateUserUseCase } from '../application/CreateUserUseCase';

export function createUserController(req, res) {
  const { name, email } = req.body;
  const useCase = new CreateUserUseCase();
  const user = useCase.execute(name, email);
  res.json(user);
}

import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity'; // Importamos la entidad

@Injectable()
export class UsersService {
  // Simulamos DB
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: '123',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}

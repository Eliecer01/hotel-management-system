import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: '123',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    // ESLint exige que si es async, devuelva una Promesa.
    // Usamos Promise.resolve para simular la espera de la DB.
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}

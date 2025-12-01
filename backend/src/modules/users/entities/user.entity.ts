export class User {
  userId: number;
  username: string;
  password: string; // En producción esto será el hash, nunca texto plano
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  token?: string;
}

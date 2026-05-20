import { User } from '../entities/User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  createProfile(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
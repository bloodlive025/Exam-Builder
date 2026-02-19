export interface IUser<T = string> {
  _id: T;
  email: T;
  password: string;
  name: T;
  lastName: T;
  joinedAt: Date;
}

export interface ICourse<T = string,U=string> {
  _id: string;
  code: string;
  name: string;
  students: T[];
  teachers: U[];
  createdAt: Date;
  updatedAt: Date;
}

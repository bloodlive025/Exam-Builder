import { IUser } from './Iuser';
import { EUserRole } from '../enum/user-role';

export interface IProfesor extends IUser {
  role: EUserRole.PROFESOR;
}

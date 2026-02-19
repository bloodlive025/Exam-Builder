import { IUser } from './Iuser';
import { EUserRole } from '../enum/user-role';

export interface IEstudiante extends IUser {
  role: EUserRole.ALUMNO;
}

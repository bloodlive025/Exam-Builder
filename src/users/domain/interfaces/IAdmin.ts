import { IUser } from './Iuser';
import { EUserRole } from '../enum/user-role';

export interface IAdmin extends IUser {
  role: EUserRole.ADMIN;
}

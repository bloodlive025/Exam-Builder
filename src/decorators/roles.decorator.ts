import {UserRole} from '../users/schemas/users.schema';
import { SetMetadata } from '@nestjs/common';


export const ROLES_KEY = 'roles';

export const Roles  = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
import { EUserRole } from 'src/users/domain/enum/user-role';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);

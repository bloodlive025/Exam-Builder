import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { EUserRole } from 'src/users/domain/enum/user-role';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
    role: EUserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const hasRole = requiredRoles.some((role) => user?.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Ruta permitida solo para: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}

import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core/services/reflector.service";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { UserRole } from "src/users/schemas/users.schema";


@Injectable()
export class RolesGuard  implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;    
        }

        const { user } = context.switchToHttp().getRequest();

        const hasRole = requiredRoles.some((role) => user?.role === role);
        
        if (!hasRole) {
            throw new ForbiddenException(
                'Solo un administrador puede crear profesores',
            );
        }

        return hasRole;
        
    }
}
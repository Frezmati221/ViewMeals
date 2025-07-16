import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { UserRoleEnum } from "../database";
import { RolesGuard } from "../guards";

export const ROLES_KEY = "roles";

export function Roles(...roles: UserRoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
  );
}



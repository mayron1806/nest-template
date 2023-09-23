import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../Entities/Permissions';

export const PERMISSIONS_KEY = 'roles';
export const Permission = (...roles: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);

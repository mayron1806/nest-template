import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../types/permissions';

export const PERMISSIONS_KEY = 'roles';
export const Permission = (...roles: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);

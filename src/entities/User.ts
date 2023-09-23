import * as moment from 'moment';
import { Entity } from './Entity';
import { UserStatus } from '@prisma/client';

export class UserEntity extends Entity<UserEntity, number> {
  public name: string;
  public email: string;
  public password: string;
  public status: UserStatus;
  public permissions: string[];
  public created_at?: Date = moment().toDate();
  public updated_at?: Date = moment().toDate();

  constructor(data: Omit<UserEntity, 'id'>, id?: number) {
    super(data, id);
  }

  protected populate(data: Omit<UserEntity, 'id'>) {
    this.name = data.name;
    this.status = data.status;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.permissions = data.permissions;
  }
}

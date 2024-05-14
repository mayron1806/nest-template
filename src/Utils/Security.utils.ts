import { AES, enc } from 'crypto-js';
import * as bcrypt from 'bcrypt';
import { env } from 'src/constants/env';

export class Security {
  private static saltRounds = 10;
  static encrypt(data: string | number) {
    return AES.encrypt(data.toString(), env.HASH_SECRET).toString();
  }
  static decrypt(data: string | number) {
    const bytes = AES.decrypt(data.toString(), env.HASH_SECRET);
    return bytes.toString(enc.Utf8);
  }
  static async hash(value: string) {
    const salt = await bcrypt.genSalt(Security.saltRounds);
    return await bcrypt.hash(value, salt);
  }
  static async hashCompare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}

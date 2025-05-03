import type { Request } from 'express';
import { IUser } from './index';

declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}

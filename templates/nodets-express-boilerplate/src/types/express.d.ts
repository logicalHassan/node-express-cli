import type { Request } from 'express';
import type { IUser } from './index';

declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}

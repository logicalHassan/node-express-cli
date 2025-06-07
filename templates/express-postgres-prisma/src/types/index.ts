import type { Request } from 'express';
import type { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import type { Token, TokenType, User } from '../../generated/prisma';

// Central export to prisma-client types
export type { User, Token, TokenType };

export type SafeUser = Omit<User, 'password'>;

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  include?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type PaginationFilters = Record<string, string | any>;

export interface PaginateResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface AppJwtPayload extends BaseJwtPayload {
  sub: string;
  type: string;
}

export interface AuthedReq extends Request {
  user: SafeUser;
}

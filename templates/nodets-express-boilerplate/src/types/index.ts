import type { tokenTypes } from '@/config/tokens';
import type { Model } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IToken {
  token: string;
  user: string;
  type: TokenTypes;
  expires: Date;
  blacklisted: boolean;
}

export type TokenTypes = (typeof tokenTypes)[keyof typeof tokenTypes];

export interface PaginatedModel<T> extends Model<T> {
  paginate(options: PaginationOptions, filters: PaginationFilters<T>): Promise<PaginateResult<T>>;
}

export type PaginationFilters<T> = Partial<{
  [K in keyof T]: string | number;
}>;

export interface PaginationOptions {
  limit?: string;
  page?: string;
  sortBy?: string;
  populate?: string;
}

export interface PaginateResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

import prisma from '@/lib/prisma';
import httpStatus from 'http-status';
import { ApiError } from '@/utils';
import { hashPassword } from '@/utils/passwordHash';
import type { PaginationOptions, PaginationFilters, User } from '@/types';
import type { User as PrismaUser } from '@prisma/client';

export const isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      NOT: excludeUserId ? { id: excludeUserId } : undefined,
    },
  });

  return !!user;
};

const createUser = async (userBody: PrismaUser) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const passwordHash = await hashPassword(userBody.password);
  userBody.password = passwordHash;

  return prisma.user.create({
    data: userBody,
    omit: {
      password: true,
    },
  });
};

const queryUsers = async (options: PaginationOptions, filters: PaginationFilters) => {
  return prisma.user.paginate<User>(options, filters, ['password']);
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const updateUserById = async (userId: string, updateBody: Partial<PrismaUser>) => {
  await getUserById(userId);

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateBody,
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  await prisma.user.delete({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

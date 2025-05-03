import paginate from '@/utils/paginate';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      paginate,
    },
  },
});

export default prisma;

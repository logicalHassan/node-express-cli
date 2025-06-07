import paginate from '@/utils/paginate';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      paginate,
    },
  },
});

export default prisma;

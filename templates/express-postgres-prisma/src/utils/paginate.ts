import type { PaginationFilters, PaginationOptions } from '@/types';

async function paginate<T>(this: any, options: PaginationOptions, filters: PaginationFilters, omit: string[] = []) {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const offset = (page - 1) * limit;

  // Convert comma-separated include string to object
  let includeOptions = {};
  if (typeof options.include === 'string') {
    includeOptions = options.include
      .split(',')
      .map((key) => key.trim())
      .reduce(
        (acc, key) => {
          if (key) acc[key] = true;
          return acc;
        },
        {} as Record<string, true>,
      );
  }

  // Search query implementation
  let searchQuery = {};
  if (filters.search) {
    const [key, value] = filters.search.split(':');
    searchQuery = {
      [key]: {
        contains: value,
        mode: 'insensitive',
      },
    };

    // biome-ignore lint/performance/noDelete: <explanation>
    delete filters.search;
  }

  // Modify filters to handle array
  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes(',')) {
      filters[key] = { in: value.split(',').map((v) => v.trim()) };
    }
  });

  // Build sorting criteria from query string
  let sort: Record<string, 'asc' | 'desc'>[];
  if (options.sortBy) {
    const sortingCriteria = [] as any;
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push({ [key]: order === 'desc' ? 'desc' : 'asc' });
    });
    sort = sortingCriteria;
  } else {
    sort = [{ createdAt: 'asc' }];
  }

  // Handle omitted fields
  const omitOptions: Record<string, boolean> = {};
  omit?.forEach((opt: string) => {
    omitOptions[opt] = true;
  });

  const where = {
    ...filters,
    ...searchQuery,
  };

  // Fetch paginated data with the sorting criteria
  const [results, totalRecords] = await Promise.all([
    this.findMany({
      where,
      include: includeOptions,
      take: limit,
      skip: offset,
      orderBy: sort,
      omit: omitOptions,
    }),
    this.count({ where }),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    results: results as T[],
    page,
    limit,
    totalRecords,
    totalPages,
  };
}

export default paginate;

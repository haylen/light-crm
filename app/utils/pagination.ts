export const RECORDS_PER_PAGE = 4;

export const getPaginationParams = (request: Request) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  return {
    skip: page ? (page - 1) * RECORDS_PER_PAGE : 0,
    take: 4,
  };
};

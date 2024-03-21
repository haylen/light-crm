import { Link, useSearchParams } from '@remix-run/react';

const setSearchParamsString = (
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>,
) => {
  const newSearchParams = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
      continue;
    }
    newSearchParams.set(key, String(value));
  }

  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key,
    )
    .join('&');
};

type TablePaginationProps = {
  totalRecorsCount: number;
  recordsPerPageCount: number;
};

export const TablePagination = ({
  totalRecorsCount,
  recordsPerPageCount,
}: TablePaginationProps) => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalRecorsCount / recordsPerPageCount);

  return (
    <div className="join">
      <Link
        to={{
          search: setSearchParamsString(searchParams, {
            page: 1,
          }),
        }}
        preventScrollReset
        prefetch="intent"
        className="join-item btn btn-outline"
      >
        «
      </Link>
      <Link
        to={{
          search: setSearchParamsString(searchParams, {
            page: page - 1 > 1 ? page - 1 : 1,
          }),
        }}
        preventScrollReset
        prefetch="intent"
        className="join-item btn btn-outline"
      >
        ‹
      </Link>
      <Link
        to={{
          search: setSearchParamsString(searchParams, {
            page: page,
          }),
        }}
        preventScrollReset
        prefetch="intent"
        className="join-item btn btn-outline btn-active"
      >
        Page {page} of {totalPages}
      </Link>
      <Link
        to={{
          search: setSearchParamsString(searchParams, {
            page: page + 1 <= totalPages ? page + 1 : page,
          }),
        }}
        preventScrollReset
        prefetch="intent"
        className="join-item btn btn-outline"
      >
        ›
      </Link>
      <Link
        to={{
          search: setSearchParamsString(searchParams, {
            page: Math.ceil(totalRecorsCount / recordsPerPageCount),
          }),
        }}
        preventScrollReset
        prefetch="intent"
        className="join-item btn btn-outline"
      >
        »
      </Link>
    </div>
  );
};

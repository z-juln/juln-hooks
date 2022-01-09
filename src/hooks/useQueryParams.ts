import { useLocation } from 'react-router-dom';
import qs from 'qs';

const useQueryParams = <T extends string>(
  params: T[]
): [Record<T, string | null>, (params: Record<T, string | null>) => void] => {
  const location = useLocation();
  const queryStr = location.search.split("?")[1];
  const query = qs.parse(queryStr);
  const entries = params.map((key) => [key, query[key] ?? null]);
  const queryParams = Object.fromEntries(entries);
  const setQueryParams = (params: Record<T, string | null>) => {
    const newQuery = Object.assign(query, params);
    const newUrl =
      window.location.pathname +
      window.location.hash.split("?")[0] +
      "?" +
      qs.stringify(newQuery);
    window.history.replaceState({}, "", newUrl);
  };
  return [queryParams, setQueryParams];
};

export default useQueryParams;

declare const useQueryParams: <T extends string>(params: T[]) => [Record<T, string | null>, (params: Record<T, string | null>) => void];
export default useQueryParams;

export interface IPagedResult<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}
export type TSubMenus = {
  label: string;
  href: string;
};

export type TMenu = {
  icon?: React.ReactNode;
  label: string;
  href: string;
  badge?: number | string;
  subMenus?: TSubMenus[];
};

export type TGettersProps = {
  take: number;
  skip: number;
  sort: string;
  order: string;
  page: number;
  search: string;
};

export type SortingState = ColumnSort[];

export type TSearchParamsData = {
  page?: number;
  skip?: number;
  count?: number;
  sort?: string;
  order?: string;
  search?: string;
  from?: string;
  to?: string;
};

export type TStatItem = {
  id: string;
  name: string;
  value: number;
  description: string;
  type: 'currency' | 'number' | 'date';
};

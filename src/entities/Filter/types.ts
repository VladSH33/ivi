export type FilterType = {
  genre?: string;
  country?: string;
  year?: string;
};

export interface FilterItem {
  id: keyof FilterType;
  label: string;
  options: {
    icon?: string;
    label: string;
  }[];
}

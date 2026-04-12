import type { SelectChangeEvent } from "@mui/material";


export interface IReusableTableProps {
  headers: ITableHeader[];
  data: ITableData[];
  handleOpen: () => void;
  handleSetItemPerPage: (event: SelectChangeEvent<number>) => void;
  handleSortChange: (name: string) => void;
  handleSetSearchQuery: (name: string) => void;
  handleSetPage: (pageNumber: number) => void;
  handleEdit: (row: ITableData) => void;
  handleDelete: (row: ITableData) => void;
  state: IPagination;
  IdName: string;
  customFilters?: ICustomFilters[];
  headerName?: string;
  link?: string;
  addButtonName: string;
  totalPages: number;
}

export interface ITableHeader {
  Key: string;
  Name: string;
  render?: (row: any) => React.ReactNode;  // Add this optional property for custom cell rendering
}

export default interface ITableData {
  [key: string]: unknown;
}

export interface IPagination {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  columnToSort: string;
  orderBy: "asc" | "desc";
  recordsTotal: number;
  recordsFiltered: number;
}
export interface ICustomFilters {
  FilterName: string;
  Value: string;
}

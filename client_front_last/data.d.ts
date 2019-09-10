export interface TableListItem {
  client_id: string;
  client_name: string;
  vip_name: string;
  last_login: Date;
  password: string;
  phonenum: string;
  vip_id: number;
  register_date: Date;
  create_vip_id: number;
  create_client_name: string;
  create_client_password: string;
  create_phonenum: string;
  update_vip_id: number;
  update_phonenum: string;
  update_password: string;
  delete_client_id: string;

}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListDate {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface PaginateQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginateResponse {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  docs: any[];
}

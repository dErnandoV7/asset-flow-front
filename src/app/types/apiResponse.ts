export type ApiResponse<T> = {
  success: boolean
  data?: T | T[]
  error?: string
}

export type ApiResponsePagination<T> = {
  success: boolean
  data?: T[]
  total?: number,
  error?: string,
}

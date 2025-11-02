export type ApiResponse<T> = {
  success: boolean
  data?: T[] | T
  error?: string
}
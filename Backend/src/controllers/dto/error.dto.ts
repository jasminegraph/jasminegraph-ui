export interface ErrorResponse {
  code: string;
  message: string;
  errorDetails?: string;
}

export interface ResponseBody {
  data?: any;
  error?: ErrorResponse;
}
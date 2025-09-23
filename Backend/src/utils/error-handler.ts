export function extractErrorDetails(err: any, context: string) {
  const errorDetails = err?.response?.data || err?.message || 'Unknown error';
  console.error(`[${context}] Error:`, errorDetails);
  return errorDetails;
}
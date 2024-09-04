type ApiRetryParams = {
  apiCall: () => Promise<any>
  maxRetries?: number
}

export const fetchWithRetry = async ({ apiCall, maxRetries = 5 }: ApiRetryParams): Promise<any> => {
  let retries = 0

  while (retries < maxRetries) {
    try {
      return apiCall()
    } catch (error) {
      retries++
      console.error(`API request failed - retry count is now ${retries}. Error:`, error)
    }
  }

  throw new Error(`API request failed after ${maxRetries} retries.`)
}

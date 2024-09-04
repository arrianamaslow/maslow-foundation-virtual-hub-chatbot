import { DataPointFulfilmentStatus } from './DataPointFulfilmentStatus'

export type DataPointFulfilmentRecord = Record<string, DataPointFulfilmentStatus>
export const isDataPointFulfilmentRecord = (map: any): map is DataPointFulfilmentStatus => {
  for (const [dataPoint, status] of Object.entries(map)) {
    if (!dataPoint || !isDataPointFulfilmentRecord(status)) {
      return false
    }
  }
  return true
}

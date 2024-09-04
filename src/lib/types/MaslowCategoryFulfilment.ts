import { DataPointFulfilmentRecord, isDataPointFulfilmentRecord } from './DataPointFulfilmentRecord'
import { isMaslowWheelCategory, MaslowWheelCategory } from './MaslowWheelCategory'
export type MaslowCategoryFulfilment = Record<MaslowWheelCategory, DataPointFulfilmentRecord>
export const isMaslowCategoryFulfilment = (record: any): record is MaslowCategoryFulfilment => {
  for (const [category, dataPointFulfilmentRecord] of Object.entries(record)) {
    if (
      !isMaslowWheelCategory(category) ||
      !isDataPointFulfilmentRecord(dataPointFulfilmentRecord)
    ) {
      return false
    }
  }
  return true
}
